import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { StatusCodes } from "http-status-codes";

const admin_jwt_middleware = async (req, res, next) => {
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
    jwt.verify(token, env.JWT_SECRET);

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

export default admin_jwt_middleware;
