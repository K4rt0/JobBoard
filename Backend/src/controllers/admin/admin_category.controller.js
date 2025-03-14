import { StatusCodes } from "http-status-codes";
import { category_service } from "~/services/admin/admin_category.service";

const create_category = async (req, res, next) => {
  try {
    const result = await category_service.create_category(req.body);

    res.status(StatusCodes.CREATED).json({
      message: "Danh mục đã được tạo thành công !",
      data: { id: result.insertedId },
    });
  } catch (error) {
    next(error);
  }
};

const get_all_categories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await category_service.get_all_categories(page, limit);
    res.status(StatusCodes.OK).json({
      message: "Đã lấy dữ liệu danh sách danh mục thành công !",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const get_category_by_id = async (req, res, next) => {
  try {
    const category = await category_service.get_category_by_id(req.params.id);

    res.status(StatusCodes.OK).json({
      message: "Đã lấy dữ liệu danh mục thành công !",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const update_category = async (req, res, next) => {
  try {
    const result = await category_service.update_category(req.params.id, req.body);

    res.status(StatusCodes.OK).json({
      message: "Đã cập nhật dữ liệu danh mục thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const delete_category = async (req, res, next) => {
  try {
    const result = await category_service.delete_category(req.params.id);
    res.status(StatusCodes.OK).json({
      message: "Đã xóa danh mục thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const category_controller = {
  create_category,
  get_all_categories,
  get_category_by_id,
  update_category,
  delete_category,
};
