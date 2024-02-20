import Filter from "bad-words";
import joi from "joi";

import { EBrand } from "../enums/brand.enum";
import { ECountry } from "../enums/country.enum";
import { ECurrency } from "../enums/currency.enum";
import { ERegion } from "../enums/region.enum";
import { badWords } from "./badWords";

export class CarValidator {
  static year = joi.number().min(1990).max(2023);
  static carModel = joi.string().min(2).max(30).trim();
  static brand = joi.valid(...Object.values(EBrand));
  static price = joi.number().min(1);
  static currency = joi.valid(...Object.values(ECurrency));
  static region = joi.valid(...Object.values(ERegion));
  static country = joi.valid(...Object.values(ECountry));
  static description = joi.string().min(2).max(150);

  static create = joi.object({
    year: this.year.required(),
    carModel: this.carModel.required(),
    brand: this.brand.required(),
    price: this.price.required(),
    currency: this.currency.required(),
    region: this.region.required(),
    country: this.country.required(),
    description: this.description.required().custom((value, helpers) => {
      const filter = new Filter({ replaceRegex: /[A-Za-z0-9가-힣_]/g });
      filter.addWords(...badWords);
      const cleanedDescription = filter.clean(value);
      if (cleanedDescription !== value) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
  });

  static update = joi.object({
    price: this.price,
    currency: this.currency,
    region: this.region,
    country: this.country,
    description: this.description,
  });
}
