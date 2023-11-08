import { model, Schema } from "mongoose";

import { EBrand } from "../enums/brand.enum";
import { EPrice } from "../enums/price.enum";
import { ICar } from "../types/cars.types";

const carSchema = new Schema(
  {
    brand: {
      type: String,
      enum: EBrand,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      enum: EPrice,
      required: true,
    },
    description: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Car = model<ICar>("car", carSchema);
