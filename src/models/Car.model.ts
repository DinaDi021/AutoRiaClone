import { model, Schema, Types } from "mongoose";

import { EBrand } from "../enums/brand.enum";
import { ECurrency } from "../enums/currency.enum";
import { ERegion } from "../enums/egion.enum";
import { ICar } from "../types/cars.types";
import { User } from "./User.model";

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
      required: true,
    },
    currency: {
      type: String,
      enum: ECurrency,
      required: true,
    },
    description: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
    views: {
      type: Number,
      default: 0,
    },
    region: {
      type: String,
      enum: ERegion,
      required: true,
    },
    exchangeRates: {
      usd: {
        type: Number,
      },
      eur: {
        type: Number,
      },
      uah: {
        type: Number,
      },
    },
    lastExchangeRateUpdate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Car = model<ICar>("car", carSchema);
