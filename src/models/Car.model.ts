import { model, Schema, Types } from "mongoose";

import { EBrand } from "../enums/brand.enum";
import { EPrice } from "../enums/price.enum";
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
      enum: EPrice,
      required: true,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Car = model<ICar>("car", carSchema);
