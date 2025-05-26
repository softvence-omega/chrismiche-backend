import USER_ROLE from "../../constants/userRole";
import { TCharacter } from "../../config/characters";
import { Types } from "mongoose";

export type TRegisterUserInput = Pick<TUser, "email" | "password">;

export interface TUser {
  fullName: string;
  email: string;
  username: string;
  gender: string;
  password: string;
  phoneNumber: string;
  character: TCharacter; // strictly typed
  ongoingMovements?: Types.ObjectId[];     // Array of ObjectIds referencing Movement documents
  onClimbingMovements?: Types.ObjectId[];
  role: "admin" | "user";
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;

  isDeleted: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
