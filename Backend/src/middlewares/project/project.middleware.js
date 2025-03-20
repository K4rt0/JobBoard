const { ObjectId } = require("mongodb");
const { user_model } = require("~/models/user.model");
const { StatusCodes } = require("http-status-codes");

const project_middleware = async (req, res, next) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(req._id) });

    if (user.role !== "Employer") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Chỉ người dùng có quyền là nhà tuyển dụng mới có thể tạo dự án !",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default project_middleware;
