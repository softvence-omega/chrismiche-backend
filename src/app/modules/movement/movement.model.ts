import { Schema, model } from "mongoose";
import { TMovement } from "./movement.interface";

const movementSchema = new Schema<TMovement>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meter: {
      type: Number,
      required: true,
    },
    floorsClimbed: {
      type: Number,
      required: true,
    },
    activityDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Movement = model<TMovement>("Movement", movementSchema);
