import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { TLoginUser } from "./auth.interface";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "./auth.utils";
import { User } from "../user/user.model";
import { sendEmail } from "../../utils/sendEmail";
import admin from "../../utils/firebase.init";
// import admin from "../../../firebase-service-account.json";
// import admin from "firebase-admin";


const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload?.email }).select(
    "+password"
  );
  // console.log(user, payload);

  // Check if user exists
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if user is deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new ApiError(httpStatus.FORBIDDEN, "User is deleted!");
  }
  // Check if password is correct
  if (!(await bcrypt.compare(payload?.password, user?.password))) {
    throw new ApiError(httpStatus.FORBIDDEN, "Password did not match!");
  }

  //----------------Create jsonwebtoken and send to the client-----------------
  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  //++++++++++++++++   ACCESS TOKEN   ++++++++++++++++
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    parseInt(config.jwt_access_expires_in as string)
  );
  //++++++++++++++++   Refresh TOKEN   ++++++++++++++++
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    parseInt(config.jwt_refresh_expires_in as string)
  );
  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.findById(userData.userId).select("+password");

  // Check if user exists
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if user is deleted
  const isUserDeleted = user?.isDeleted;
  if (isUserDeleted) {
    throw new ApiError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  // Check if user is blocked
  // const userStatus = user?.status;
  // if (userStatus === "blocked") {
  //   throw new ApiError(httpStatus.FORBIDDEN, "User is blocked!");
  // }

  // Check if password is correct
  if (!(await bcrypt.compare(payload?.oldPassword, user?.password))) {
    throw new ApiError(httpStatus.FORBIDDEN, "Password did not match!");
  }

  // Hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    }
  );
  return null; // No need to send password as response. That's why we did not assign update operation in result variable too
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId } = decoded;

  // checking if the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new ApiError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  // const userStatus = user?.status;
  // if (userStatus === "blocked") {
  //   throw new ApiError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  // }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    parseInt(config.jwt_access_expires_in as string)
  );

  return {
    accessToken,
  };
};


// 1. Send OTP to Email
const sendForgotPasswordOTP = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes

  user.passwordResetOTP = otp;
  user.passwordResetExpires = expires;
  user.passwordResetVerified = false;
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  });

  return null;
};

// 2. Verify Only OTP (no new password at this step)
const verifyOnlyOTP = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;

  const user = await User.findOne({ email }).select(
    "+passwordResetOTP +passwordResetExpires +passwordResetVerified"
  );

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    user.passwordResetOTP !== otp ||
    !user.passwordResetExpires ||
    user.passwordResetExpires < new Date()
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
  }

  user.passwordResetVerified = true;
  await user.save();

  return { verified: true };
};

const resetPasswordAfterOTP = async (payload: { newPassword: string }) => {
  const { newPassword } = payload;

  const user = await User.findOne({
    passwordResetVerified: true,
    passwordResetExpires: { $gt: new Date() },
  }).select("+email +passwordResetVerified");

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP not verified or expired");
  }

  user.password = newPassword;
  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;

  await user.save();

  return null;
};

const socialLogin = async ({ provider, idToken }: { provider: string; idToken: string }) => {
  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid ID token");
  }

  const { email, name, picture, uid } = decodedToken;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required from provider");
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      photoUrl: picture,
      provider,           // Save provider (google/facebook)
      firebaseUid: uid,
      password: Math.random().toString(36).slice(-8),
    });
  }

  if (user.isDeleted) {
    throw new ApiError(httpStatus.FORBIDDEN, "User is deleted!");
  }

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    parseInt(config.jwt_access_expires_in as string)
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    parseInt(config.jwt_refresh_expires_in as string)
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  resetPasswordAfterOTP,
  sendForgotPasswordOTP,
  verifyOnlyOTP,
  socialLogin
};
