import { StatusCodes } from "http-status-codes";
import { user_service } from "~/services/account/user.service";

const create_user = async (req, res, next) => {
  try {
    const result = await user_service.create_user(req.body);

    res.status(StatusCodes.CREATED).json({
      message: "Tạo người dùng thành công !",
      data: { id: result.insertedId },
    });
  } catch (error) {
    next(error);
  }
};

const login_user = async (req, res, next) => {
  try {
    const result = await user_service.login_user(req.body);
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

const get_profile = async (req, res, next) => {
  try {
    const result = await user_service.get_user_by_id(req._id);
    res.status(StatusCodes.OK).json({
      message: "Lấy dữ liệu người dùng thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout_user = async (req, res, next) => {
  try {
    const user_id = req._id;
    const result = await user_service.logout_user(user_id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const user_controller = {
  create_user,
  login_user,
  logout_user,
  get_profile,
};
