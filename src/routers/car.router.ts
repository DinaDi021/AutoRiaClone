import { Router } from "express";

import { carController } from "../controllers/car.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { carMiddleware } from "../middlewares/car.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { fileMiddleware } from "../middlewares/files.middleware";
import { CarValidator } from "../validators/car.validator";

const router = Router();

router.get("/", carController.getAll);
router.post(
  "/",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(CarValidator.create),
  carController.createCar,
);

router.get(
  "/:carId",
  commonMiddleware.isIdValid("carId"),
  carMiddleware.getByIdOrThrow,
  carController.getById,
);
router.put(
  "/:carId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("carId"),
  commonMiddleware.isBodyValid(CarValidator.update),
  carController.updateCar,
);

router.post(
  "/:carId/gallery",
  authMiddleware.checkAccessToken,
  fileMiddleware.isAvatarValid,
  carController.uploadAvatar,
);
router.delete(
  "/:carId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("carId"),
  carController.deleteCar,
);

export const carRouter = router;
