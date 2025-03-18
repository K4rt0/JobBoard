import { StatusCodes } from "http-status-codes";
import { user_service } from "~/services/user/user.service";

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
    const result = await user_service.get_user(user_id);
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
    const result = await user_service.get_all_users();

    res.status(StatusCodes.OK).json({
      message: "Lấy dữ liệu người dùng thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_users_pagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { status, role, sort, search } = req.query;
    const filtered = {};
    if (status && ["Active", "Deleted", "Blocked"].includes(status)) filtered.status = status;
    if (role && ["All", "Freelancer", "Employer"].includes(role)) filtered.role = role;
    if (sort && ["all", "oldest", "newest"].includes(sort.toLowerCase())) filtered.sort = sort;
    if (search) filtered.search = search;

    const result = await user_service.get_all_users_pagination(page, limit, filtered);

    res.status(StatusCodes.OK).json({
      message: "Lấy dữ liệu người dùng thành công !",
      data: result,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const update_user_status = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const result = await user_service.update_user(user_id, req.body);

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

const change_user_password = async (req, res, next) => {
  try {
    const { old_password, new_password, retype_new_password } = req.body;
    const result = await user_service.change_user_password(req._id, old_password, new_password, retype_new_password);

    res.status(StatusCodes.OK).json({
      message: "Đổi mật khẩu thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update_user = async (req, res, next) => {
  try {
    const result = await user_service.update_user(req._id, req.body, req.files && req.files.avatar ? req.files.avatar : null);

    res.status(StatusCodes.OK).json({
      message: "Cập nhật thông tin người dùng thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update_skills = async (req, res, next) => {
  try {
    await user_service.update_skills(req._id, req.body.skills);

    res.status(StatusCodes.OK).json({
      message: "Thêm kỹ năng thành công !",
    });
  } catch (error) {
    next(error);
  }
};

const update_socials = async (req, res, next) => {
  try {
    await user_service.update_socials(req._id, req.body.socials);

    res.status(StatusCodes.OK).json({
      message: "Cập nhật thông tin mạng xã hội thành công !",
    });
  } catch (error) {
    next(error);
  }
};

export const user_controller = {
  // Admin
  get_user,
  update_user_status,
  get_all_users_pagination,
  get_all_users,

  // User
  create_user,
  change_user_password,
  update_user,
  update_skills,
  update_socials,
};
