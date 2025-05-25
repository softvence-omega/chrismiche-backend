import { Movement } from "./movement.model";
import { TMovement } from "./movement.interface";
import { FilterQuery } from "mongoose";

export const createMovement = async (payload: TMovement) => {
  return await Movement.create(payload);
};

export const getUserMovements = async (
  userId: string,
  startDate?: string,
  endDate?: string
) => {
  const query: FilterQuery<TMovement> = {
    user: userId,
  };

  if (startDate || endDate) {
    query.activityDate = {};
    if (startDate) {
      query.activityDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.activityDate.$lte = new Date(endDate);
    }
  }

  return await Movement.find(query).sort({ activityDate: -1 });
};
