import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import crypto from "crypto";

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
    username: {
      type: String,
    },
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
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Reset token generator method (optional if you use a service instead)
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 mins
  return resetToken;
};

export const User = model<TUser>("User", userSchema);
