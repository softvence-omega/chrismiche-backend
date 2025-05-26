import climbingMovementModel from "./climbingMovement.model";
import { MovementInput } from "./movement.interface";
import ongoingMovementModel from "./ongoingMovement.model";


export const saveOngoingMovement = async (data: MovementInput) => {
  return await ongoingMovementModel.findOneAndUpdate(
    { userId: data.userId, date: data.date },
    { distance: data.distance },
    { upsert: true, new: true }
  );
};

export const saveClimbingMovement = async (data: MovementInput) => {
  return await climbingMovementModel.findOneAndUpdate(
    { userId: data.userId, date: data.date },
    { distance: data.distance },
    { upsert: true, new: true }
  );
};
