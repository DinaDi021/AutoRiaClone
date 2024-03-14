import { Document } from "mongoose";

import { ERoles } from "../enums/roles.enum";
import { EUserStatus } from "../enums/user-status.enum";
import { EUserType } from "../enums/user-type.enum";

export interface IUser extends Document {
  userName: EUserType;
  age: number;
  email: string;
  password: string;
  status: EUserStatus;
  roles: ERoles;
  isBlocked: boolean;
  avatar: string;
  isAccountPremium: boolean;
}

export type IUserCredentials = Pick<IUser, "email" | "password">;
export interface ISetNewPassword extends Pick<IUser, "password"> {
  newPassword: string;
}
