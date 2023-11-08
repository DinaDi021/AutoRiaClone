import { NextFunction, Request, Response } from "express";

import { userService } from "../services/user.services";
import { ITokenPayload } from "../types/token.types";
import { IUser } from "../types/users.types";

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
}

export const userController = new UserController();
