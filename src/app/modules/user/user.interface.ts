import {  Model } from "mongoose";
import USER_ROLE from "../../constants/userRole";
import { TCharacter } from "../../config/characters";

export type TRegisterUserInput = Pick<TUser, "email" | "password">;

export interface TUser {
  fullName: string
  email: string;
  username: string;
  gender: string
  password: string;
  // confirmPassword: string;
  // image: string;
  phoneNumber: string;
  character: TCharacter; // strictly typed
  role: "admin" | "user";
  passwordResetToken?: string | null
  passwordResetExpires?: Date | null

  isDeleted: boolean;
}

// export type TUserRole = keyof typeof USER_ROLE;
