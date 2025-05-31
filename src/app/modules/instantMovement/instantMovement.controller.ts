import { Request, Response } from "express";
import { saveInstantMovement } from "./instantMovement.service";

export const postTrackingRun = async (req: Request, res: Response) => {
    
  try {
    const { date, time, distance } = req.body;
    const userId = (req as any).user?._id;
//     console.log("userId:", userId);
// console.log("date:", date);
// console.log("time:", time);
// console.log("distance:", distance, typeof distance);

    if (!userId || !date || !time || typeof distance !== "number") {
      return res.status(400).json({ message: "Invalid input." });
    }

    const data = await saveInstantMovement({ userId, date, time, distance, type: "run" });

    return res.status(200).json({ message: "Running movement saved", data });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
  
};

export const postTrackingClimb = async (req: Request, res: Response) => {
  try {
    const { date, time, distance } = req.body;
    const userId = (req as any).user?._id;

    if (!userId || !date || !time || typeof distance !== "number") {
      return res.status(400).json({ message: "Invalid input." });
    }

    const data = await saveInstantMovement({ userId, date, time, distance, type: "climb" });

    return res.status(200).json({ message: "Climbing movement saved", data });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
