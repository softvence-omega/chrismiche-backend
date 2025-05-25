import { Types } from "mongoose";

export type TMovementType = "running" | "climbing";

export type TMovement = {
  user: Types.ObjectId; // ✅ Allow ObjectId for compatibility with Mongoose schema
  type: TMovementType;
  meter?: number;
  floorsClimbed?: number;
  activityDate: Date;
};
