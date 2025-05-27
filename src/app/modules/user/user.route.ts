import express from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middleWear/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "@/app/middleWear/auth";

const router = express.Router();

router.get("/:id", UserControllers.getSingleUser);
router.get("/", UserControllers.getAllUsers);
router.post(
  "/createUser",
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createAUser
);
router.patch(
  "/",
  auth('user'),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser
);

export const UserRoutes = router; 
