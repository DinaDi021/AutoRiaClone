import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/users.types";
import { EFileTypes, s3Service } from "./s3.service";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async updateUser(
    manageUserId: string,
    dto: Partial<IUser>,
    userId: string,
    roles: string,
  ): Promise<IUser> {
    this.checkAbilityToManage(roles, userId, manageUserId);
    return await userRepository.updateOneById(manageUserId, dto);
  }

  public async deleteUser(
    manageUserId: string,
    userId: string,
    roles: string,
  ): Promise<void> {
    this.checkAbilityToManage(roles, userId, manageUserId);
    await userRepository.deleteUser(userId);
  }

  public async getMe(userId: string): Promise<IUser> {
    return await userRepository.findById(userId);
  }

  public async uploadAvatar(
    avatar: UploadedFile,
    userId: string,
  ): Promise<IUser> {
    const user = await userRepository.findById(userId);

    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    const filePath = await s3Service.uploadFile(
      avatar,
      EFileTypes.User,
      userId,
    );

    const updatedUser = await userRepository.updateOneById(userId, {
      avatar: filePath,
    });

    return updatedUser;
  }

  private checkAbilityToManage(
    roles: string,
    userId: string,
    manageUserId: string,
  ): void {
    if (roles === "Admin") {
      return;
    } else if (userId !== manageUserId) {
      throw new ApiError("You do not have permission to update this user", 403);
    }
  }
}

export const userService = new UserService();
