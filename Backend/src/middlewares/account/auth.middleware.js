import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { StatusCodes } from "http-status-codes";

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
    const userId = decoded._id;
    const user = await user_model.findOne({ _id: userId });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        statusCode: StatusCodes.NOT_FOUND,
        message: "User not found",
      });
    }

    if (user.status === "Deleted" || user.status === "Blocked") {
      return res.status(StatusCodes.FORBIDDEN).json({
        statusCode: StatusCodes.FORBIDDEN,
        message: `Account is ${user.status.toLowerCase()}`,
      });
    }

    req.user = decoded;
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
