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
    roles: string,
  ): Promise<ICar> {
    await this.checkAbilityToManage(carId, userId, roles);
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
    await this.checkAbilityToManage(carId, userId, roles);
    await carRepository.deleteCar(carId);
  }

  public async uploadAvatar(
    carId: string,
    avatar: UploadedFile,
    userId: string,
    roles: string,
  ): Promise<ICar> {
    this.checkAbilityToManage(carId, userId, roles);
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
  public checkAbilityToManage(
    carId: string,
    userId: string,
    roles: string,
  ): void {
    this.checkRole(roles);
    this.checkUserPermission(carId, userId);
  }

  private checkRole(roles: string): void {
    if (roles === "Admin" || roles === "Manager") {
      return;
    } else {
      throw new ApiError("You do not have permission to manage this car", 403);
    }
  }

  private checkUserPermission(userId: string, carId: string): void {
    if (userId !== carId) {
      throw new ApiError("You do not have permission to manage this car", 403);
    }
  }
}

export const carService = new CarService();
