// src/interfaces/user.interface.ts
import USER_ROLE from "@/app/constants/userRole";
import { TCharacter } from "../../config/characters";
import { Types } from "mongoose";

export type TRegisterUserInput = Pick<TUser, "email" | "password">;

export interface TUser {
  _id: string;
  fullName: string;
  email: string;
  username?: string;
  gender?: string;
  password: string; // Optional for social users
  phoneNumber?: string;
  character?: TCharacter;
  ongoingMovements?: Types.ObjectId[];
  onClimbingMovements?: Types.ObjectId[];
  role: "admin" | "user";
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  passwordResetOTP?: string;
  otp?: string;
  otpExpires?: Date;
  isDeleted: boolean;

  // New fields for social login
  provider?: "google" | "facebook" | "credentials";
  firebaseUID?: string;
  avatar?: string;
}


export type TUserRole = keyof typeof USER_ROLE;