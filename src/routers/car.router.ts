import { Router } from "express";

import { carController } from "../controllers/car.controller";
import { statisticController } from "../controllers/statistic.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { carMiddleware } from "../middlewares/car.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { fileMiddleware } from "../middlewares/files.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { CarValidator } from "../validators/car.validator";

const router = Router();

router.get("/", userMiddleware.checkUserStatus, carController.getAll);
router.post(
  "/",
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  userMiddleware.checkAccountType,
  userMiddleware.checkRole(["Admin", "Manager", "Seller"]),
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.createCar,
);

router.get(
  "/:carId",
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  carController.getById,
);

router.get(
  "/:carId/priceStatistic",
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  userMiddleware.checkAccountType,
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  statisticController.getPriceStatisticsByCarId,
);

router.get(
  "/:carId/views",
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  userMiddleware.checkAccountType,
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  statisticController.getViewsStatisticsByCarId,
);

router.put(
  "/:carId",
  authMiddleware.checkAccessToken,
  userMiddleware.checkAccountType,
  commonMiddleware.isIdValid("carId"),
  commonMiddleware.isBodyValid(CarValidator.update),
  carController.updateCar,
);

router.post(
  "/:carId/gallery",
  authMiddleware.checkAccessToken,
  userMiddleware.checkUserStatus,
  commonMiddleware.isIdValid("carId"),
  fileMiddleware.isAvatarValid,
  carController.uploadImages,
);
router.delete(
  "/:carId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("carId"),
  carController.deleteCar,
);

export const carRouter = router;
