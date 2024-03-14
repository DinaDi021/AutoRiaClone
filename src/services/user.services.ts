import { UploadedFile } from "express-fileupload";

import { configs } from "../configs/configs";
import { EEmailAction } from "../enums/email.action.enum";
import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/users.types";
import { emailService } from "./email.service";
import { liqPaymentService } from "./liqPay.service";
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

  public async callbackToPremium(
    data: string,
    signature: string,
  ): Promise<void> {
    const decodedData = liqPaymentService.decodedData(data);
    const parsedData = JSON.parse(decodedData);

    const userId = parsedData.userId;

    const privateKey = configs.private_key;
    const expectedSignature = liqPaymentService.generateSignatureCallback(
      privateKey,
      data,
    );

    if (signature !== expectedSignature) {
      throw new ApiError("Invalid signature", 400);
    }

    if (!userId) {
      throw new ApiError("User ID is missing in the callback data", 400);
      return;
    }
    await this.toPremium(userId);
  }

  public async toPremium(userId: string): Promise<IUser> {
    const updatedUserData: Partial<IUser> = {
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

  public async getManagers(): Promise<IUser[]> {
    const managers = await userRepository.getByParams({
      roles: "Manager",
    });

    if (!managers) {
      throw new ApiError("Manager not found", 404);
      return;
    }

    return managers;
  }

  public async sendMessageToManagers(email: string): Promise<void> {
    console.log(email);
    const managers = await this.getManagers();
    for (const manager of managers) {
      await emailService.sendMail(
        manager.email,
        EEmailAction.CHOOSE_OTHER_BRAND,
        { email },
      );
    }
  }

  private async checkRole(roles: string): Promise<void> {
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
