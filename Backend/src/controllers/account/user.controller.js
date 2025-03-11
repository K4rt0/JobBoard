import { StatusCodes } from "http-status-codes";
import { user_service } from "~/services/account/user.service";

const create_user = async (req, res, next) => {
  try {
    const result = await user_service.create_user(req.body);

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
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
      message: "Login successful",
      data: {
        id: result._id,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
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
      message: "Profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const user_controller = {
  create_user,
  login_user,
  get_profile,
};
