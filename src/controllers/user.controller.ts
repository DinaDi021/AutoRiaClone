import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";

import { userPresenter } from "../presenters/user.presenter";
import { liqPaymentService } from "../services/liqPay.service";
import { userService } from "../services/user.services";
import {
  Action,
  Currency,
  ILanguage,
  IPayload,
} from "../types/forLiqPay.types";
import { ITokenPayload } from "../types/token.types";
import { IUser } from "../types/users.types";

function generateOrderId(): string {
  return uuidv4();
}

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();

      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, roles } = req.res.locals.tokenPayload as ITokenPayload;

      await userService.deleteUser(req.params.userId, userId, roles);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, roles } = req.res.locals.tokenPayload as ITokenPayload;

      const user = await userService.updateUser(
        req.params.userId,
        req.body,
        userId,
        roles,
      );

      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.res.locals;

      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;
      const user = await userService.getMe(userId);

      res.json(user);
    } catch (e) {
      next(e);
    }
  }

  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser>> {
    try {
      const { userId, roles } = req.res.locals.tokenPayload as ITokenPayload;
      const avatar = req.files.avatar as UploadedFile;
      const user = await userService.uploadAvatar(
        req.params.userId,
        avatar,
        userId,
        roles,
      );

      const response = userPresenter.present(user);

      return res.json(response);
    } catch (e) {
      next(e);
    }
  }

  public async BuyPremiumAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const payload: IPayload = {
        userId: userId,
        action: Action.PAY,
        amount: 500,
        currency: Currency.UAH,
        description: "Premium Subscription",
        order_id: generateOrderId(),
        language: ILanguage.UA,
        server_url: "http://localhost:5000/users/toPremium/callback",
      };

      const htmlForm = liqPaymentService.getHtmlForm(payload);

      res.send(htmlForm);
    } catch (e) {
      next(e);
    }
  }

  public async callbackToPremium(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const paymentData = req.body;

      const { data, signature } = paymentData;
      await userService.callbackToPremium(data, signature);

      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  public async blockUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roles } = req.res.locals.tokenPayload as ITokenPayload;

      await userService.blockUser(req.params.userId, roles);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async unblockUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roles } = req.res.locals.tokenPayload as ITokenPayload;

      await userService.unblockUser(req.params.userId, roles);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }


}

export const userController = new UserController();
