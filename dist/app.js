"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const http = __importStar(require("http"));
const mongoose = __importStar(require("mongoose"));
const socket_io_1 = require("socket.io");
const configs_1 = require("./configs/configs");
const crons_1 = require("./crons");
const auth_router_1 = require("./routers/auth.router");
const car_router_1 = require("./routers/car.router");
const user_router_1 = require("./routers/user.router");
const app = (0, express_1.default)();
const server = http.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use("/users", user_router_1.userRouter);
app.use("/cars", car_router_1.carRouter);
app.use("/auth", auth_router_1.authRouter);
app.use((error, req, res, next) => {
    const status = error.status || 500;
    res.status(status).json({
        message: error.message,
        status: error.status,
    });
});
server.listen(configs_1.configs.PORT, async () => {
    await mongoose.connect(configs_1.configs.DB_URI);
    (0, crons_1.cronRunner)();
    console.log(`has started ${configs_1.configs.PORT}`);
});
