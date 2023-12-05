import joi from "joi";

import { regexConstant } from "../constatnts/regex.constant";
import { EBrand } from "../enums/brand.enum";
import { ECurrency } from "../enums/currency.enum";
import { ERegion } from "../enums/egion.enum";

export class CarValidator {
  static year = joi.number().min(1990).max(2023);
  static carModel = joi.string().min(2).max(30).trim();
  static brand = joi.valid(...Object.values(EBrand));
  static price = joi.number().min(1);
  static currency = joi.valid(...Object.values(ECurrency));
  static region = joi.valid(...Object.values(ERegion));
  static description = joi
    .string()
    .min(2)
    .max(150)
    .regex(regexConstant.BAD_WORDS);

  static create = joi.object({
    year: this.year.required(),
    carModel: this.carModel.required(),
    brand: this.brand.required(),
    price: this.price.required(),
    currency: this.currency.required(),
    region: this.region.required(),
    description: this.description.required(),
  });

  static update = joi.object({
    price: this.price,
    currency: this.currency,
    region: this.region.required(),
    description: this.description,
  });
}
