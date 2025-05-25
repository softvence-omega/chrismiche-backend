import { Types } from "mongoose";

export type TMovement = {
    user: Types.ObjectId; // user _id
    meter: number;
    floorsClimbed: number;
    activityDate: Date; // date-time from client
  };
  