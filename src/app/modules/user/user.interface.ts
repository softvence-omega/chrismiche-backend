import {  Model } from "mongoose";
import USER_ROLE from "../../constants/userRole";

export type TRegisterUserInput = Pick<TUser, "email" | "password" | "confirmPassword">;

export interface TUser {
  fullName: string
  email: string;
  username: string;
  gender: string
  password: string;
  confirmPassword: string;
  image: string;
  phoneNumber: string;
  character: string;
  role: "admin" | "user";
  passwordResetToken?: string | null
  passwordResetExpires?: Date | null

  isDeleted: boolean;
}

// export type TUserRole = keyof typeof USER_ROLE;
