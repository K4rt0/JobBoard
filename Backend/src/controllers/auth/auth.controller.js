import { StatusCodes } from "http-status-codes";
import { auth_service } from "~/services/auth/auth.service";

// Admin
const admin_login = async (req, res, next) => {
  try {
    const result = await auth_service.admin_login(req.body);

    res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công !",
      data: {
        access_token: result.access_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// User
const login_user = async (req, res, next) => {
  try {
    const result = await auth_service.login_user(req.body);
    res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công !",
      data: {
        id: result._id,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout_user = async (req, res, next) => {
  try {
    const user_id = req._id;
    const result = await auth_service.logout_user(user_id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const refresh_token = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const result = await auth_service.refresh_token(refresh_token);
    res.status(StatusCodes.OK).json({
      message: "Token đã được làm mới",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const auth_controller = {
  // Admin
  admin_login,

  // User
  login_user,
  logout_user,
  refresh_token,
};
