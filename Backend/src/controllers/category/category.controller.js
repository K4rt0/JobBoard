import { StatusCodes } from "http-status-codes";
import { category_service } from "~/services/category/category.service";

const create_category = async (req, res, next) => {
  try {
    const result = await category_service.create_category(req.body);

    if (Array.isArray(req.body)) {
      res.status(StatusCodes.CREATED).json({
        message: "Các danh mục đã được tạo thành công !",
        data: { insertedIds: result.insertedIds },
      });
    } else {
      res.status(StatusCodes.CREATED).json({
        message: "Danh mục đã được tạo thành công !",
        data: { id: result.insertedId },
      });
    }
  } catch (error) {
    next(error);
  }
};

const get_all_categories_pagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { sort, search } = req.query;
    const filtered = {};
    if (sort && ["all", "oldest", "newest"].includes(sort.toLowerCase()))
      filtered.sort = sort;
    if (search) filtered.search = search;

    const result = await category_service.get_all_categories_pagination(
      page,
      limit,
      filtered,
    );

    res.status(StatusCodes.OK).json({
      message: "Đã lấy dữ liệu danh sách danh mục thành công !",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_categories = async (req, res, next) => {
  try {
    const result = await category_service.get_all_categories();

    res.status(StatusCodes.OK).json({
      message: "Đã lấy dữ liệu danh sách danh mục thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_category = async (req, res, next) => {
  try {
    const category = await category_service.get_category(req.params.id);

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
    const result = await category_service.update_category(
      req.params.id,
      req.body,
    );

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
  get_all_categories_pagination,
  get_category,
  update_category,
  delete_category,
};
