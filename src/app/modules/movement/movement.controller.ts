import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import * as movementService from "./movement.service";

export const createMovement = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const payload = { ...req.body, user: userId };

  const result = await movementService.createMovement(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Movement data created successfully",
    data: result,
  });
});

export const getMyMovements = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { startDate, endDate } = req.query;

  const result = await movementService.getUserMovements(
    userId,
    startDate as string,
    endDate as string
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "User movement data fetched successfully",
    data: result,
  });
});
