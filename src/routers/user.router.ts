import { Router } from "express";
import { carController } from "../controllers/car.controller";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { fileMiddleware } from "../middlewares/files.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.get(
  "/",
  userMiddleware.checkRole(["Admin", "Manager"]),
  userController.getAll,
);

router.get("/me", authMiddleware.checkAccessToken, userController.getMe);

router.get(
  "/:userId",
  userMiddleware.checkRole(["Admin", "Manager"]),
  commonMiddleware.isIdValid("userId"),
  userMiddleware.getByIdOrThrow,
  userController.getById,
);

router.put(
  "/:userId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateUser,
);

router.put(
  "/:userId/block",
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(["Admin", "Manager"]),
  commonMiddleware.isIdValid("userId"),
  userController.blockUser,
);

router.put(
  "/:userId/unblock",
  authMiddleware.checkAccessToken,
  userMiddleware.checkRole(["Admin", "Manager"]),
  commonMiddleware.isIdValid("userId"),
  userController.unblockUser,
);

router.get(
  "/:userId/toPremium",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("userId"),
  userController.BuyPremiumAccount,
);

router.post("/toPremium/callback", userController.callbackToPremium);

router.delete(
  "/:userId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("userId"),
  userController.deleteUser,
);

router.post(
  "/:userId/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isAvatarValid,
  userController.uploadAvatar,
);

export const userRouter = router;
