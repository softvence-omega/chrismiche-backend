import express from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middleWear/validateRequest";
import { AuthValidation } from "./auth.validation";
import USER_ROLE from "../../constants/userRole";
import auth from "../../middleWear/auth";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);


router.post("/social-login", AuthControllers.socialLogin);
// router.post("/firebase-login", AuthControllers.firebaseLogin);

router.post(
  "/change-password",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post("/forgot-password/send-otp", AuthControllers.sendForgotPasswordOTP);
router.post("/forgot-password/verify-otp", AuthControllers.verifyOnlyOTP);
router.post("/reset-password", AuthControllers.resetPassword);


export const AuthRoutes = router;
