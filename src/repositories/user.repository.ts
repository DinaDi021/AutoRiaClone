import { FilterQuery } from "mongoose";

import { User } from "../models/User.model";
import { IUser, IUserCredentials } from "../types/users.types";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }

  public async getOneByParams(
    params: FilterQuery<IUser>,
    selection?: string[],
  ): Promise<IUser> {
    return await User.findOne(params, selection);
  }

  public async getByParams(
    params: FilterQuery<IUser>,
    selection?: string[],
  ): Promise<IUser[]> {
    return await User.find(params, selection);
  }

  public async findById(id: string): Promise<IUser> {
    return await User.findById(id);
  }

  public async register(dto: IUserCredentials): Promise<IUser> {
    return await User.create(dto);
  }

  public async updateOneById(
    userId: string,
    dto: Partial<IUser>,
  ): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async setStatus(userId: string, status: string): Promise<void> {
    await User.updateOne({ _id: userId }, { $set: { status } });
  }

  public async deleteUser(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }

  public async blockUser(userId: string): Promise<void> {
    await User.updateOne({ _id: userId }, { $set: { isBlocked: true } });
  }

  public async unblockUser(userId: string): Promise<void> {
    await User.updateOne({ _id: userId }, { $set: { isBlocked: false } });
  }
}

export const userRepository = new UserRepository();
