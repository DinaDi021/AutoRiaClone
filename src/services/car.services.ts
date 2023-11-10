import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api.error";
import { carRepository } from "../repositories/car.repository";
import { ICar } from "../types/cars.types";
import { EFileTypes, s3Service } from "./s3.service";

class CarService {
  public async getAll(): Promise<ICar[]> {
    return await carRepository.getAll();
  }

  public async updateCar(
    carId: string,
    dto: Partial<ICar>,
    userId: string,
  ): Promise<ICar> {
    await this.checkAbilityToManage(userId, carId);
    return await carRepository.updateCar(carId, dto);
  }

  public async createCar(dto: ICar, userId: string): Promise<ICar> {
    return await carRepository.createCar(dto, userId);
  }

  public async deleteCar(carId: string, userId: string): Promise<void> {
    await this.checkAbilityToManage(userId, carId);
    await carRepository.deleteCar(carId);
  }

  public async uploadAvatar(
    avatar: UploadedFile,
    carId: string,
  ): Promise<ICar> {
    const car = await carRepository.findById(carId);

    if (car.avatar) {
      await s3Service.deleteFile(car.avatar);
    }

    const filePath = await s3Service.uploadFile(avatar, EFileTypes.Car, carId);

    const updatedCar = await carRepository.updateCar(carId, {
      avatar: filePath,
    });

    return updatedCar;
  }

  private async checkAbilityToManage(
    userId: string,
    manageCarId: string,
  ): Promise<ICar> {
    const car = await carRepository.getOneByParams({
      _userId: userId,
      _id: manageCarId,
    });
    if (!car) {
      throw new ApiError("You do not have permission to update this user", 403);
    }
    return car;
  }
}

export const carService = new CarService();
