import mongoose, { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<TUser>(
  {
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, required: false },
    gender: {
      type: String,
      enum: ["male", "female", "other"], // optional enum for cleaner data
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm Password is required"],
      select: false,
    },
    image: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
    },
    character: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  "save",
  async function (next: (err?: mongoose.CallbackError) => void) {
    const user = this as any; // or use: this as TUser & mongoose.Document;

    if (!user.isModified("password")) {
      return next();
    }

    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;

      // Remove confirmPassword field so it’s not stored
      delete user.confirmPassword;

      next();
    } catch (error) {
      next(error as mongoose.CallbackError);
    }
  }
);

export const User = model<TUser>("User", userSchema);
