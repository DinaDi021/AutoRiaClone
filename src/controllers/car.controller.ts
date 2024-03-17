import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import * as path from "path";

import { carPresenter } from "../presenters/car.presenter";
import { statisticRepository } from "../repositories/statistic.repository";
import { carService } from "../services/car.services";
import { ICar } from "../types/cars.types";
import { ITokenPayload } from "../types/token.types";

class CarController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar[]>> {
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

      const carData = req.body;

      if (carData.isValidDescription) {
        carData.announcementActive = true;
      } else {
        carData.announcementActive = false;
      }

      const car = await carService.createCar(carData, userId);

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
      const { userId, roles } = req.res.locals.tokenPayload as ITokenPayload;

      await carService.deleteCar(req.params.carId, userId, roles);

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
      const { userId, roles } = req.res.locals.tokenPayload as ITokenPayload;

      const carData = req.body;

      if (carData.isValidDescription) {
        carData.announcementActive = true;
      } else {
        carData.announcementActive = false;
      }

      const car = await carService.updateCar(
        req.params.carId,
        carData,
        userId,
        roles,
      );

      res.status(201).json(car);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const car = req.res.locals;
      await statisticRepository.createOrUpdateViews(car._id);
      res.json(car);
    } catch (e) {
      next(e);
    }
  }

  public async openChat(req: Request, res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, "../index.html"));
  }

  public async uploadImages(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICar>> {
    try {
      const { userId, roles } = req.res.locals.tokenPayload as ITokenPayload;
      const carId = req.params.carId;
      const avatar = req.files.avatar as UploadedFile;
      CarController.uploadedImages.push(avatar);
      const car = await carService.uploadImages(carId, avatar, userId, roles);

      const response = carPresenter.present(car);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  static uploadedImages: UploadedFile[] = [];
}

export const carController = new CarController();
