// src/models/user.model.ts
import mongoose, { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import { CharacterList } from "../../config/characters";

const userSchema = new Schema<TUser>(
  {
    fullName: { type: String, default: "" },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    password: {
      type: String,
      select: false,
    },
    phoneNumber: { type: String },
    character: {
      type: String,
      enum: CharacterList,
      default: "Robo",
    },
    ongoingMovements: [{ type: Schema.Types.ObjectId, ref: "OngoingMovement" }],
    onClimbingMovements: [{ type: Schema.Types.ObjectId, ref: "ClimbingMovement" }],
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },

    passwordResetOTP: { type: String, select: false },
    passwordResetExpires: { type: Date },
    otp: { type: String },
    otpExpires: { type: Date },

    // Social login additions
    provider: {
      type: String,
      enum: ["google", "facebook", "credentials"],
      default: "credentials",
    },
    firebaseUID: { type: String, unique: true, sparse: true },
    avatar: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

// Hash password only for traditional credentials users
userSchema.pre(
  "save",
  async function (next: (err?: mongoose.CallbackError) => void) {
    const user = this as any;

    if (!user.isModified("password") || !user.password) {
      return next();
    }

    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;

      next();
    } catch (error) {
      next(error as mongoose.CallbackError);
    }
  }
);

export const User = model<TUser>("User", userSchema);
