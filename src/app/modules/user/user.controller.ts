import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { createToken } from "../auth/auth.utils";
import config from "../../config";

const getAllUsers = catchAsync(async (_req, res) => {
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
  const user = await UserServices.createAUserIntoDB(req.body);

  if (!user?._id || !user?.email || !user?.role) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User creation failed");
  }

  // const tokenPayload = {
  //   _id: user._id,
  //   email: user.email,
  //   role: user.role,
  // };

  // const accessToken = createToken(
  //   tokenPayload,
  //   config.jwt_access_secret!,
  //   config.jwt_access_expires_in!
  // );

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };


    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      parseInt(config.jwt_access_expires_in as string)
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: {
      user,
      accessToken,
    },
  });
});


const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id; // ⬅️ Use user ID from auth middleware
  const payload = req.body;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized user");
  }

  const result = await UserServices.updateUserInDB(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  getAllUsers,
  createAUser,
  updateUser,
};
