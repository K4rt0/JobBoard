import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { StatusCodes } from "http-status-codes";
import { user_model } from "~/models/user.model";
import { ObjectId } from "mongodb";

const jwt_auth = (is_admin = false) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status_code: StatusCodes.UNAUTHORIZED,
        message: "Phiên đăng nhập không hợp lệ !",
      });

    let query;

    if (req._id) query = { _id: new ObjectId(req._id) };
    else if (req.body && req.body.email) query = { email: req.body.email };
    else if (req.headers["authorization"]) {
      const token = authHeader.split(" ")[1];
      if (!token)
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status_code: StatusCodes.UNAUTHORIZED,
          message: "Token không hợp lệ !",
        });
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (!is_admin) query = { _id: new ObjectId(decoded._id) };
      } catch (error) {
        if (error.name === "TokenExpiredError")
          return res.status(StatusCodes.UNAUTHORIZED).json({
            status_code: StatusCodes.NOT_FOUND,
            message: "Token đã hết hạn !",
          });
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status_code: StatusCodes.NOT_FOUND,
          message: "Token không hợp lệ !",
        });
      }
    }

    if (!is_admin) {
      const user = await user_model.find_user(query);

      if (!user)
        return res.status(StatusCodes.NOT_FOUND).json({
          status_code: StatusCodes.NOT_FOUND,
          message: "Người dùng không tồn tại !",
        });

      if (user.status === "Deleted" || user.status === "Blocked")
        return res.status(StatusCodes.FORBIDDEN).json({
          status_code: StatusCodes.FORBIDDEN,
          message: `Tài khoản này đã ${user.status === "Deleted" ? "bị xóa" : "bị khóa"} !`,
        });

      req._id = user._id.toString();
    }
    next();
  };
};

export const auth_middleware = { jwt_auth };
