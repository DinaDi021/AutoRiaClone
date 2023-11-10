import { model, Schema } from "mongoose";

import { ERoles } from "../enums/roles.enum";
import { EUserStatus } from "../enums/user-status.enum";
import { IUser } from "../types/users.types";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      min: [1, "Minimum age is 1"],
      max: [199, "Maximum age is 199"],
    },
    status: {
      type: String,
      enum: EUserStatus,
      required: true,
      default: EUserStatus.inactive,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      enum: ERoles,
      required: true,
    },
    avatar: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", function (next) {
  if (this.roles !== ERoles.Buyer && this.roles !== ERoles.Seller) {
    const error = new Error("Only Buyers and Sellers are allowed to register.");
    next(error);
  } else {
    next();
  }
});

export const User = model<IUser>("user", userSchema);
