import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";
import ApiError from "../../errors/ApiError";


const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  // console.log(req.body)
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: { accessToken },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePassword(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password is updated successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  // console.log(refreshToken);
  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is refreshed successfully!",
    data: result,
  });
});

const sendForgotPasswordOTP = catchAsync(async (req, res) => {
  await AuthServices.sendForgotPasswordOTP(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "6 digit OTP has been sent to your email",
    data: "OTP will be valid for only 10 minutes"
  });
});

const verifyOnlyOTP = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyOnlyOTP(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await AuthServices.resetPasswordAfterOTP(req.body); // body: { newPassword: '...' }

  sendResponse(res, {
    success: true,
    message: "Password reset successful",
    statusCode: httpStatus.OK,
    data: null,
  });
});

const socialLogin = catchAsync(async (req, res) => {
  const { provider, idToken } = req.body;

  if (!provider || !idToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Provider and ID token are required");
  }

  const result = await AuthServices.socialLogin({ provider, idToken });

  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Social login successful",
    data: { accessToken },
  });
});



export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  sendForgotPasswordOTP,
  resetPassword,
  verifyOnlyOTP,
  socialLogin
};
