import ApiError from "../../errors/ApiError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";

const getAllUsersFromDB = async () => {
  const result = await User.find({ isDeleted: false });
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const deletedOrBlockedUser = await User.findOne({
    _id: id,
    isDeleted: false,
    status: { $ne: "blocked" },
  });
  if (!deletedOrBlockedUser)
    throw new ApiError(httpStatus.FORBIDDEN, "Failed to Fetch user");

  const result = await User.findById(id);
  return result;
};

const createAUserIntoDB = async (payload: Partial<TUser>) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User with this email already exists");
  }

  const userToSave: Partial<TUser> = {
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName ?? "",
    username: payload.username ?? "",
    gender: payload.gender ?? undefined,
    phoneNumber: payload.phoneNumber ?? undefined,
    character: payload.character ?? "Robo",
    role: payload.role ?? "user",
  };

  const createdUser = await User.create(userToSave);

  // If password select is false, make sure to re-fetch with fields you want (optional)
  const plainUser = await User.findById(createdUser._id).lean();

  return plainUser;
};

const updateUserInDB = async (userId: string, payload: Partial<TUser>) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: payload },
    { new: true, runValidators: true }
  ).select("-password"); // don't return password

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return updatedUser;
};

export const UserServices = {
  getSingleUserFromDB,
  getAllUsersFromDB,
  createAUserIntoDB,
  updateUserInDB,
};
