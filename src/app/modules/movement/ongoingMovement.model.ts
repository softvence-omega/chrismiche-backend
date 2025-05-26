import mongoose, { Schema, Document } from "mongoose";

export interface IOngoingMovement extends Document {
  userId: string;
  date: string;
  distance: number;
}

const OngoingMovementSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    distance: { type: Number, required: true },
  },
  { timestamps: true }
);

OngoingMovementSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IOngoingMovement>(
  "OngoingMovement",
  OngoingMovementSchema
);
