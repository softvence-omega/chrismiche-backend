import mongoose, { Schema, Document } from "mongoose";

export interface IClimbingMovement extends Document {
  userId: string;
  date: string;
  distance: number;
}

const ClimbingMovementSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    distance: { type: Number, required: true },
  },
  { timestamps: true }
);

ClimbingMovementSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IClimbingMovement>(
  "ClimbingMovement",
  ClimbingMovementSchema
);
