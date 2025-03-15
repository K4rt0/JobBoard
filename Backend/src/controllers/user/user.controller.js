import { StatusCodes } from "http-status-codes";
import { user_service } from "~/services/account/user.service";

// Admin
const get_user = async (req, res, next) => {
  try {
    let user_id;

    if (req.params.id) user_id = req.params.id;
    else if (req._id) user_id = req._id;
    else
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Không tìm thấy người dùng !",
        data: result,
      });

    const result = await user_service.get_user_by_id(user_id);
    res.status(StatusCodes.OK).json({
      message: "Lấy dữ liệu người dùng thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_users = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { status, role, sort, search } = req.query;
    const filterObj = {};
    if (status && ["Active", "Deleted", "Blocked"].includes(status)) filterObj.status = status;
    if (role && ["All", "Freelancer", "Employer"].includes(role)) filterObj.role = role;
    if (sort && ["all", "oldest", "newest"].includes(sort.toLowerCase())) filterObj.sort = sort;
    if (search) filterObj.search = search;

    const result = await admin_user_service.get_all_users(page, limit, filterObj);

    res.status(StatusCodes.OK).json({
      message: "Lấy dữ liệu người dùng thành công !",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const update_user_status = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const { status } = req.body;
    const result = await admin_user_service.update_user_status(user_id, status);
    res.status(StatusCodes.OK).json({
      message: "Cập nhật trạng thái người dùng thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// User
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

export const user_controller = {
  // Admin
  get_user,
  update_user_status,
  get_all_users,

  // User
  create_user,
};
