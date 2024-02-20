export enum Action {
  PAY = "pay",
  HOLD = "hold",
  SUBSCRIBE = "subscribe",
  AUTH = "auth",
  LETTER_OF_CREDIT = "letter_of_credit",
  SPLIT_RULES = "split_rules",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  UAH = "UAH",
}

export interface IPayload {
  userId: string;
  action: Action;
  amount: number;
  currency: Currency;
  description: string;
  order_id: string;
  language?: ILanguage;
  server_url: string;
}

export interface IPaymentInfo extends IPayload {
  public_key: string;
  version?: string;
  sandbox?: string;
}

export interface ISignature {
  data: string;
  signature: string;
}

export enum ILanguage {
  UA = "uk",
  EN = "en",
}
