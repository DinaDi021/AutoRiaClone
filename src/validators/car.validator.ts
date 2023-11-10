import joi from "joi";

import { EBrand } from "../enums/brand.enum";
import { EPrice } from "../enums/price.enum";

export class CarValidator {
  static year = joi.number().min(1990).max(2023);
  static carModel = joi.string().min(2).max(30).trim();
  static brand = joi.valid(...Object.values(EBrand));
  static price = joi.number().min(1);
  static currency = joi.valid(...Object.values(EPrice));
  static description = joi.string().min(2).max(150);

  static create = joi.object({
    year: this.year.required(),
    carModel: this.carModel.required(),
    brand: this.brand.required(),
    price: this.price.required(),
    currency: this.currency.required(),
    description: this.description.required(),
  });

  static update = joi.object({
    price: this.price,
    currency: this.currency,
    description: this.description,
  });
}
