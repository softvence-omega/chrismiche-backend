import climbingMovementModel from "./climbingMovement.model";
import ongoingMovementModel from "./ongoingMovement.model";
import { MovementInput } from "./movement.interface";
import { User } from "../user/user.model";

export const saveOngoingMovement = async (data: MovementInput) => {
  const movement = await ongoingMovementModel.findOneAndUpdate(
    { userId: data.userId, date: data.date },
    { distance: data.distance },
    { upsert: true, new: true }
  );

  await User.findByIdAndUpdate(data.userId, {
    $addToSet: { ongoingMovements: movement._id },
  });

  return movement;
};

export const saveClimbingMovement = async (data: MovementInput) => {
  const movement = await climbingMovementModel.findOneAndUpdate(
    { userId: data.userId, date: data.date },
    { distance: data.distance },
    { upsert: true, new: true }
  );

  await User.findByIdAndUpdate(data.userId, {
    $addToSet: { onClimbingMovements: movement._id },
  });

  return movement;
};
