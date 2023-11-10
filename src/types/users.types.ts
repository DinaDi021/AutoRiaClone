import { Document } from "mongoose";

import { ERoles } from "../enums/roles.enum";
import { EUserStatus } from "../enums/user-status.enum";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  status: EUserStatus;
  roles: ERoles;
  isBlocked: boolean;
  avatar: string;
}

export type IUserCredentials = Pick<IUser, "email" | "password">;
export interface ISetNewPassword extends Pick<IUser, "password"> {
  newPassword: string;
}
