import { Document } from "mongoose";

import { EBrand } from "../enums/brand.enum";
import { EPrice } from "../enums/price.enum";

export interface ICar extends Document {
  brand: EBrand;
  carModel: string;
  year: number;
  price: number;
  currency: EPrice;
  description: string;
  avatar: string;
}
