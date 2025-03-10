import { StatusCodes } from "http-status-codes";
import { refresh_token_service } from "~/services/auth/refesh_token.service";

const refresh_token = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const result = await refresh_token_service.refresh_token(refresh_token);
    res.status(StatusCodes.OK).json({
      message: "Token đã được làm mới",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh_token_controller = {
  refresh_token,
};
