import { Schema, model } from "mongoose";
import { TInstantMovement } from "./instantMovement.interface";

const instantMovementSchema = new Schema<TInstantMovement>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // e.g., "25 June, 2025"
    time: { type: String, required: true }, // e.g., "15:30:45"
    distance: { type: Number, required: true },
    type: { type: String, enum: ["run", "climb"], required: true },
  },
  { timestamps: true }
);

export const InstantMovement = model<TInstantMovement>("InstantMovement", instantMovementSchema);
