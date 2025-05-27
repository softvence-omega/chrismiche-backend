import { TInstantMovement } from "./instantMovement.interface";
import { InstantMovement } from "./instantMovement.model";

export const saveInstantMovement = async (data: TInstantMovement) => {
  const saved = await InstantMovement.create(data);
  return saved;
};
