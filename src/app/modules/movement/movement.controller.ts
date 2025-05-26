import { Request, Response } from "express";
import { saveClimbingMovement, saveOngoingMovement } from "./movement.service";


export const postOngoingMovement = async (req: Request, res: Response) => {
  try {
    const { date, distance } = req.body;
    const userId = (req as any).user?._id;

    if (!userId || !date || typeof distance !== "number") {
      return res.status(400).json({ message: "Invalid input." });
    }

    const data = await saveOngoingMovement({ userId, date, distance });
    return res.status(200).json({ message: "Ongoing movement saved", data });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const postClimbingMovement = async (req: Request, res: Response) => {
  try {
    const { date, distance } = req.body;
    const userId = (req as any).user?._id;

    if (!userId || !date || typeof distance !== "number") {
      return res.status(400).json({ message: "Invalid input." });
    }

    const data = await saveClimbingMovement({ userId, date, distance });
    return res.status(200).json({ message: "Climbing movement saved", data });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
