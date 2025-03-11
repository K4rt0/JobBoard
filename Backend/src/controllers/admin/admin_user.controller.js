import { StatusCodes } from "http-status-codes";
import { admin_user_service } from "~/services/admin/admin_user.service";

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
      message: "Users retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
export const admin_user_controller = {
  get_all_users,
};
