import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import * as http from "http";
import * as mongoose from "mongoose";
import { Server } from "socket.io";

import { configs } from "./configs/configs";
import { cronRunner } from "./crons";
import { ApiError } from "./errors/api.error";
import { authRouter } from "./routers/auth.router";
import { carRouter } from "./routers/car.router";
import { userRouter } from "./routers/user.router";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/users", userRouter);
app.use("/cars", carRouter);
app.use("/auth", authRouter);
app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;

  res.status(status).json({
    message: error.message,
    status: error.status,
  });
});

server.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  cronRunner();
  console.log(`has started ${configs.PORT}`);
});
