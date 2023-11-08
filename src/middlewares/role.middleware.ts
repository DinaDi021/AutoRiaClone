import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { tokenService } from "../services/token.service";

class RoleMiddleware {
  public checkRole(role: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.get("Authorization");
        console.log(token);

        if (!token) {
          throw new ApiError("No Token!", 401);
        }
        const userRole = tokenService.findRolesInToken(token);

        if (!userRole) {
          throw new ApiError("User not found", 404);
        }

        if (userRole === role) {
          next();
        } else {
          throw new ApiError("Access denied", 403);
        }
      } catch (e) {
        next(e);
      }
    };
  }
}

export const roleMiddleware = new RoleMiddleware();
