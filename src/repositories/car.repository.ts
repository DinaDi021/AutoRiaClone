import { FilterQuery } from "mongoose";

import { Car } from "../models/Car.model";
import { ICar } from "../types/cars.types";

class CarRepository {
  public async getAll(): Promise<ICar[]> {
    const cars = await Car.find().populate("_userId");
    return cars;
  }

  public async getAllByParams(filter: FilterQuery<ICar>): Promise<ICar[]> {
    const cars = await Car.find(filter);
    return cars;
  }

  public async getOneByParams(params: FilterQuery<ICar>): Promise<ICar> {
    return await Car.findOne(params);
  }

  public async findById(id: string): Promise<ICar> {
    return await Car.findById(id);
  }

  public async createCar(dto: ICar, userId: string): Promise<ICar> {
    const newCar = await Car.create({ ...dto, _userId: userId });
    return newCar;
  }

  public async updateCar(carId: string, dto: Partial<ICar>): Promise<ICar> {
    return await Car.findByIdAndUpdate(carId, dto, {
      returnDocument: "after",
    });
  }

  public async updateCarPrices(
    filter: FilterQuery<ICar>,
    update: any,
  ): Promise<void> {
    try {
      await Car.updateMany(filter, update);
    } catch (e) {
      throw e;
    }
  }

  public async deleteCar(carId: string): Promise<void> {
    await Car.deleteOne({ _id: carId });
  }
}

export const carRepository = new CarRepository();
