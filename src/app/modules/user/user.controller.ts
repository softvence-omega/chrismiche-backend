import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { User } from "./user.model";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data retrieved successfully",
    data: result,
  });
});

const createAUser = catchAsync(async (req, res) => {
  const result = await UserServices.createAUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updatePayload = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const UserControllers = {
  getSingleUser,
  getAllUsers,
  createAUser,
};
