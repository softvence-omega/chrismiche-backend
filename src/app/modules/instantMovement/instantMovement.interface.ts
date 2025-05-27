import { Types } from "mongoose";

export type TInstantMovement = {
  userId: Types.ObjectId;
  date: string; // "25 June, 2025"
  time: string; // "hh:mm:ss"
  distance: number; // in meters
  type: "run" | "climb";
};
