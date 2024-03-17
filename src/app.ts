import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import * as http from "http";
import * as mongoose from "mongoose";
import { Server, Socket } from "socket.io";

import { configs } from "./configs/configs";
import { carController } from "./controllers/car.controller";
import { cronRunner } from "./crons";
import { ApiError } from "./errors/api.error";
import { authMiddleware } from "./middlewares/auth.middleware";
import { authRouter } from "./routers/auth.router";
import { carRouter } from "./routers/car.router";
import { userRouter } from "./routers/user.router";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get("/chat", authMiddleware.checkAccessToken, carController.openChat);

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

const connections: Socket[] = [];

io.sockets.on("connection", function (socket) {
  console.log("+");
  connections.push(socket);

  socket.on("disconnect", function () {
    connections.splice(connections.indexOf(socket), 1);
    console.log("-");
  });

  socket.on("send mess", function (data) {
    io.sockets.emit("add mess", {
      mess: data.mess,
      name: data.name,
      className: data.className,
    });
  });
});

server.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  cronRunner();
  console.log(`has started ${configs.PORT}`);
});
