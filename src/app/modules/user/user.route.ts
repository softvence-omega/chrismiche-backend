import express from "express";
import { updateUser, UserControllers } from "./user.controller";
import { validateRequest } from "../../middleWear/validateRequest";
import { UserValidations } from "./user.validation";

const router = express.Router();

router.get("/:id", UserControllers.getSingleUser);
router.get("/", UserControllers.getAllUsers);
router.post(
  "/createUser",
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createAUser
);
router.patch(
  "/:id",
  validateRequest(UserValidations.updateUserValidationSchema),
  updateUser
);

export const UserRoutes = router;
