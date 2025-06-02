import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
import config from "../config";
// import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import ApiError from "../errors/ApiError";
import { verifyToken } from "../modules/auth/auth.utils";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, _res, next) => {
    const rawToken = req.headers.authorization;

    // Check if token is sent
    if (!rawToken) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Token not found: Unauthorized User!"
      );
    }

    const token = rawToken.split(" ")[1]; // ✅ Proper extraction

    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch (error) {
      console.error("JWT verification error:", error); // ✅ Debug info
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized access happened"
      );
    }

    // console.log("Decoded token:", decoded);
    const { userId, role } = decoded;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (user?.isDeleted) {
      throw new ApiError(httpStatus.FORBIDDEN, "User is deleted!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Role mismatched. Unauthorized User!"
      );
    }

    req.user = user;
    next();
  });
};

export default auth;
