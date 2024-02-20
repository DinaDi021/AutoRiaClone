import { UploadedFile } from "express-fileupload";

import { ECurrency } from "../enums/currency.enum";
import { ApiError } from "../errors/api.error";
import { carRepository } from "../repositories/car.repository";
import { statisticRepository } from "../repositories/statistic.repository";
import { ICar } from "../types/cars.types";
import { ExchangeRateData } from "../types/currency.types";
import { EFileTypes, s3Service } from "./s3.service";
import { currencyService } from "./сurrencyService";

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
    const exchangeRates = await currencyService.getExchangeRates();
    const priceInUAH = await this.calculatePriceInUAH(
      dto.price,
      dto.currency,
      exchangeRates,
    );

    const carData: ICar = {
      ...dto,
      _userId: userId,
      exchangeRates: {
        usd: exchangeRates.usd,
        eur: exchangeRates.eur,
        uah: exchangeRates.uah,
      },
      priceInUAH: priceInUAH,
    } as ICar;

    const newCar = await carRepository.createCar(carData, userId);

    await statisticRepository.createPriceStatisticForCar(newCar._id);

    return newCar;
  }

  public async calculatePriceInUAH(
    price: number,
    currency: ECurrency,
    exchangeRates: any,
  ): Promise<number> {
    if (currency === ECurrency.UAH) {
      return price;
    } else if (currency === ECurrency.USD) {
      return price * exchangeRates.usd;
    } else if (currency === ECurrency.EUR) {
      return price * exchangeRates.eur;
    }
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
    avatar: UploadedFile,
    userId: string,
    roles: string,
  ): Promise<ICar> {
    this.checkUpdatePermission(userId, carId, roles);

    const filePath = await s3Service.uploadFile(avatar, EFileTypes.Car, carId);

    const car = await carRepository.getOneByParams({
      _id: carId,
    });

    car.avatar = [...(car.avatar || []), filePath];

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
