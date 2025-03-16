import { StatusCodes } from "http-status-codes";
import admin_login_service from "~/services/admin/admin_login.service";

const admin_login_controller = async (req, res, next) => {
  try {
    const result = await admin_login_service(req.body);

    res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công !",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default admin_login_controller;
