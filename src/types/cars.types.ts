import { Document, Types } from "mongoose";

import { EBrand } from "../enums/brand.enum";
import { ECurrency } from "../enums/currency.enum";

export interface ICar extends Document {
  brand: EBrand;
  carModel: string;
  year: number;
  price: number;
  currency: ECurrency;
  description?: string;
  image: string[];
  _userId: Types.ObjectId | string;
  views: number;
  region?: string;
  exchangeRates: {
    usd: number;
    eur: number;
    uah: number;
  };
  lastExchangeRateUpdate: Date;
}

export type IExchangeRates = Pick<ICar, "exchangeRates">;
