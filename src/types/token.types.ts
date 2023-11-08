import { Document, Types } from "mongoose";

import { EActionTokenType } from "../enums/actionTokenType";
import { IUser } from "./users.types";

export interface ITokenPayload {
  userId: string;
  roles?: string;
}

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId | IUser;
}

export interface IActionTokenDocument extends Document {
  token: string;
  type: EActionTokenType;
  _userId: Types.ObjectId | IUser;
}

export interface IActionToken
  extends Pick<IActionTokenDocument, "token" | "type" | "_userId"> {}
