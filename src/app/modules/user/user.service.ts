import config from "../../config";
import ApiError from "../../errors/ApiError";
import { TRegisterUserInput, TUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";
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
  // Check if email already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User with this email already exists");
  }

  // Validate passwords
  // if (payload.password !== payload.confirmPassword) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
  // }

  // Hash the password
  const hashedPassword = await bcrypt.hash(
    payload.password as string,
    Number(config.bcrypt_salt_rounds)
  );

  // Create user object for saving
  const userToSave: Partial<TUser> = {
    email: payload.email,
    password: hashedPassword,
    // confirmPassword: hashedPassword, // stored but select: false
  };

  // Optional: allow adding other fields if available
  if (payload.fullName) userToSave.fullName = payload.fullName;
  if (payload.username) userToSave.username = payload.username;
  if (payload.gender) userToSave.gender = payload.gender;
  if (payload.image) userToSave.image = payload.image;
  if (payload.phoneNumber) userToSave.phoneNumber = payload.phoneNumber;
  if (payload.character) userToSave.character = payload.character;

  const createdUser = await User.create(userToSave);
  return createdUser;
};


export const UserServices = {
  getSingleUserFromDB,
  getAllUsersFromDB,
  createAUserIntoDB,
};
