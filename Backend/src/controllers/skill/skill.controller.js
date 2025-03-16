import { StatusCodes } from "http-status-codes";
import { skill_service } from "~/services/skill/skill.service";

const create_skill = async (req, res, next) => {
  try {
    const result = await skill_service.create_skill(req.body);

    if (Array.isArray(req.body)) {
      res.status(StatusCodes.CREATED).json({
        message: "Các kỹ năng đã được tạo thành công !",
        data: { insertedIds: result.insertedIds },
      });
    } else {
      res.status(StatusCodes.CREATED).json({
        message: "Kỹ năng đã được tạo thành công !",
        data: { id: result.insertedId },
      });
    }
  } catch (error) {
    next(error);
  }
};

const get_all_skills_pagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await skill_service.get_all_skills_pagination(page, limit);

    res.status(StatusCodes.OK).json({
      message: "Đã lấy dữ liệu danh sách kỹ năng thành công !",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_skills = async (req, res, next) => {
  try {
    const result = await skill_service.get_all_skills();

    res.status(StatusCodes.OK).json({
      message: "Đã lấy dữ liệu danh sách kỹ năng thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_skill_by_id = async (req, res, next) => {
  try {
    const skill = await skill_service.get_skill_by_id(req.params.id);

    res.status(StatusCodes.OK).json({
      message: "Đã lấy dữ liệu kỹ năng thành công !",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

const update_skill = async (req, res, next) => {
  try {
    const result = await skill_service.update_skill(req.params.id, req.body);

    res.status(StatusCodes.OK).json({
      message: "Đã cập nhật dữ liệu kỹ năng thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const delete_skill = async (req, res, next) => {
  try {
    const result = await skill_service.delete_skill(req.params.id);

    res.status(StatusCodes.OK).json({
      message: "Đã xóa kỹ năng thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const skill_controller = {
  create_skill,
  get_all_skills,
  get_all_skills_pagination,
  get_skill_by_id,
  update_skill,
  delete_skill,
};
