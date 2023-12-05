import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api.error";
import { carRepository } from "../repositories/car.repository";
import { ICar } from "../types/cars.types";
import { ExchangeRateData } from "../types/currency.types";
import { EFileTypes, s3Service } from "./s3.service";

class CarService {
  public async getAll(): Promise<ICar[]> {
    return await carRepository.getAll();
  }

  public async updateCar(
    carId: string,
    dto: Partial<ICar>,
    userId: string,
    roles: string,
  ): Promise<ICar> {
    await this.checkUpdatePermission(userId, carId, roles);
    return await carRepository.updateCar(carId, dto);
  }

  public async createCar(dto: ICar, userId: string): Promise<ICar> {
    return await carRepository.createCar(dto, userId);
  }

  public async deleteCar(
    carId: string,
    userId: string,
    roles: string,
  ): Promise<void> {
    await this.checkUpdatePermission(userId, carId, roles);
    await carRepository.deleteCar(carId);
  }

  public async uploadImages(
    carId: string,
    image: UploadedFile,
    userId: string,
    roles: string,
  ): Promise<ICar> {
    this.checkUpdatePermission(userId, carId, roles);

    const filePath = await s3Service.uploadFile(image, EFileTypes.Car, carId);

    const car = await carRepository.getOneByParams({
      _id: carId,
    });

    car.image = [...(car.image || []), filePath];

    const updatedCar = await carRepository.updateCar(carId, car);

    return updatedCar;
  }

  public async updateCarPrices(exchangeRates: ExchangeRateData): Promise<void> {
    try {
      const update = {
        $set: {
          exchangeRates,
          lastExchangeRateUpdate: new Date(),
        },
      };

      await carRepository.updateCarPrices({}, update);
    } catch (e) {
      throw e;
    }
  }

  public async checkUpdatePermission(
    userId: string,
    manageCarId: string,
    roles: string,
  ): Promise<ICar> {
    if (roles === "Admin" || roles === "Manager") {
      const car = await carRepository.getOneByParams({
        _id: manageCarId,
      });

      if (!car) {
        throw new ApiError("Car not found", 404);
      }

      return car;
    }

    const car = await carRepository.getOneByParams({
      _userId: userId,
      _id: manageCarId,
    });

    if (!car) {
      throw new ApiError("You do not have permission to manage this car", 403);
    }

    return car;
  }
}

export const carService = new CarService();
