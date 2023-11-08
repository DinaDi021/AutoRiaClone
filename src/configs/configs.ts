import { config } from "dotenv";

config();

export const configs = {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.DB_URI,
  FRONT_URL: process.env.FRONT_URL,

  SECRET_SALT: process.env.SECRET_SALT,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACTIVATE_SECRET: process.env.JWT_ACTIVATE_SECRET,
  JWT_FORGOT_SECRET: process.env.JWT_FORGOT_SECRET,

  NO_REPLY_EMAIL: process.env.NO_REPLY_EMAIL,
  NO_REPLY_PASSWORD: process.env.NO_REPLY_PASSWORD,
};
