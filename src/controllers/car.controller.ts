import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { carPresenter } from "../presenters/car.presenter";
import { carService } from "../services/car.services";
import { ITokenPayload } from "../types/token.types";
import { IUser } from "../types/users.types";

class CarController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const cars = await carService.getAll();

      return res.json(cars);
    } catch (e) {
      next(e);
    }
  }

  public async createCar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;

      const car = await carService.createCar(req.body, userId);

      res.status(201).json(car);
    } catch (e) {
      next(e);
    }
  }
  public async deleteCar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;

      await carService.deleteCar(req.params.carId, userId);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateCar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;

      const car = await carService.updateCar(
        req.params.carId,
        req.body,
        userId,
      );

      res.status(201).json(car);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const car = req.res.locals;

      res.json(car);
    } catch (e) {
      next(e);
    }
  }

  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { carId } = req.params;
      const avatar = req.files.avatar as UploadedFile;
      const car = await carService.uploadAvatar(avatar, carId);

      const response = carPresenter.present(car);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }
}

export const carController = new CarController();
