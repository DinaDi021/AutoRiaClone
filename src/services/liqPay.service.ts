import { createHash } from "crypto";

import { configs } from "../configs/configs";
import {
  ILanguage,
  IPayload,
  IPaymentInfo,
  ISignature,
} from "../types/forLiqPay.types";

class LiqPayService {
  private baseUrl: string = "https://www.liqpay.ua/api";
  private imageSrc: string = "//static.liqpay.ua/buttons/p1ru.radius.png";
  private apiVersion: string = "3";
  private enableSandbox: boolean = false;
  public getHtmlForm(payload: IPayload): string {
    const { data, signature } = this.getObjData(payload);

    return `
            <form method="POST" action="${this.baseUrl}/${this.apiVersion}/checkout" accept-charset="utf-8">
                <input type="hidden" name="data" value="${data}" />
                <input type="hidden" name="signature" value="${signature}" />
                <input type="image" src="${this.imageSrc}" />
            </form>
        `;
  }

  private preparePayment(payload: IPayload): IPaymentInfo {
    const payment: IPaymentInfo = Object.assign<IPaymentInfo, IPayload>(
      {} as any,
      payload,
    );

    if (!payment.language) {
      payment.language = ILanguage.UA;
    }

    if (this.enableSandbox) {
      payment.sandbox = "1";
    }

    payment.version = this.apiVersion;
    payment.public_key = configs.public_key;

    return payment;
  }

  private verifyPaymentData(payment: IPaymentInfo): void {
    if (!payment.version) {
      throw new TypeError(`Version must be specified!`);
    }

    if (!payment.amount) {
      throw new TypeError(`Amount must be specified!`);
    }

    if (!payment.currency) {
      throw new TypeError(`Currency must be specified!`);
    }

    if (!payment.description) {
      throw new TypeError(`Description must be specified!`);
    }
  }
  private generateData(paymentData: IPaymentInfo): string {
    return Buffer.from(JSON.stringify(paymentData)).toString("base64");
  }

  public decodedData(data: string): string {
    return Buffer.from(data, "base64").toString("utf-8");
  }

  public getObjData(payload: IPayload): ISignature {
    const payment: IPaymentInfo = this.preparePayment(payload);

    this.verifyPaymentData(payment);

    const data: string = this.generateData(payment);
    const signature: string = this.generateSignature(data);

    return {
      data,
      signature,
    };
  }

  public generateSignature(data: string): string {
    const sha = createHash("sha1");
    sha.update(configs.private_key + data + configs.private_key);

    return sha.digest("base64");
  }

  public generateSignatureCallback = (
    privateKey: string,
    data: string,
  ): string => {
    const sha = createHash("sha1");
    sha.update(privateKey + data + privateKey);
    return sha.digest("base64");
  };
}
export const liqPaymentService = new LiqPayService();
