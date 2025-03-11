import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { StatusCodes } from "http-status-codes";
import { user_model } from "~/models/user.model";
import { ObjectId } from "mongodb";

const jwt_auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Phiên đăng nhập không hợp lệ !",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Token không hợp lệ !",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user_id = decoded._id;
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        message: "Người dùng không tồn tại !",
      });
    }

    if (user.status === "Deleted" || user.status === "Blocked") {
      return res.status(StatusCodes.FORBIDDEN).json({
        statusCode: StatusCodes.FORBIDDEN,
        message: `Account is ${user.status.toLowerCase()}`,
      });
    }

    const { password, refresh_token, ...userWithoutSensitiveInfo } = user;
    req.user = userWithoutSensitiveInfo;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Token đã hết hạn !",
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Token không hợp lệ !",
      error: error.message,
    });
  }
};

export const auth_middleware = { jwt_auth };
