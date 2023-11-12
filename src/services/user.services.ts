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
    this.checkUpdatePermission(userId, manageUserId, roles);
    return await userRepository.updateOneById(manageUserId, dto);
  }

  public async deleteUser(
    manageUserId: string,
    userId: string,
    roles: string,
  ): Promise<void> {
    this.checkUpdatePermission(userId, manageUserId, roles);
    await userRepository.deleteUser(manageUserId);
  }

  public async getMe(userId: string): Promise<IUser> {
    return await userRepository.findById(userId);
  }

  public async uploadAvatar(
    manageUserId: string,
    avatar: UploadedFile,
    userId: string,
    roles: string,
  ): Promise<IUser> {
    this.checkUpdatePermission(userId, manageUserId, roles);

    const filePath = await s3Service.uploadFile(
      avatar,
      EFileTypes.User,
      manageUserId,
    );

    const updatedUser = await userRepository.updateOneById(manageUserId, {
      avatar: filePath,
    });

    return updatedUser;
  }

  public async toPremium(
    userId: string,
    dto: Partial<IUser>,
    roles: string,
  ): Promise<IUser> {
    this.checkRole(roles);
    const updatedUserData: Partial<IUser> = {
      ...dto,
      isAccountPremium: true,
    };
    return await userRepository.updateOneById(userId, updatedUserData);
  }

  public async blockUser(userId: string, roles: string): Promise<void> {
    this.checkRole(roles);
    await userRepository.blockUser(userId);
  }

  public async unblockUser(userId: string, roles: string): Promise<void> {
    this.checkRole(roles);
    await userRepository.unblockUser(userId);
  }

  private checkRole(roles: string): void {
    if (roles === "Admin" || roles === "Manager") {
      return;
    } else {
      throw new ApiError("You do not have permission to manage this user", 403);
    }
  }

  private checkUpdatePermission(
    userId: string,
    manageUserId: string,
    roles: string,
  ): void {
    if (roles === "Admin" || roles === "Manager") {
      return;
    }
    if (userId === manageUserId) {
      return;
    }
    throw new ApiError("You do not have permission to manage this user", 403);
  }
}

export const userService = new UserService();
