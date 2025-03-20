import { StatusCodes } from "http-status-codes";
import { project_service } from "~/services/project/project.service";
import Joi from "joi";

const create_project = async (req, res, next) => {
  try {
    const result = await project_service.create_project(req._id, req.body);

    res.status(StatusCodes.CREATED).json({
      message: "Tạo dự án thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update_project = async (req, res, next) => {
  try {
    const result = await project_service.update_project(req.params.project_id, req.body);

    res.status(StatusCodes.OK).json({
      message: "Cập nhật dự án thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_projects = async (req, res, next) => {
  try {
    const result = await project_service.get_all_projects();

    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách dự án thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_projects_pagination = async (req, res, next) => {
  try {
    const schema = Joi.object({
      page: Joi.number().min(1).default(1),
      limit: Joi.number().min(1).default(10),
      search: Joi.string().default(""),
      location: Joi.string().max(50),
      salary_min: Joi.number().min(0),
      salary_max: Joi.number().min(0),
      job_type: Joi.array().items(Joi.string().valid("full-time", "part-time", "remote", "internship")),
      experience: Joi.number().min(0),
    });

    const query = await schema.validateAsync(req.query);

    const result = await project_service.get_all_projects_pagination(query);

    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách dự án thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_project = async (req, res, next) => {
  try {
    const result = await project_service.get_project(req.params.project_id, false);

    res.status(StatusCodes.OK).json({
      message: "Lấy dự án thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update_project_status = async (req, res, next) => {
  try {
    const result = await project_service.update_project_status(req.params.project_id, req.body.status);

    res.status(StatusCodes.OK).json({
      message: "Cập nhật trạng thái dự án thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const project_controller = {
  create_project,
  update_project,
  get_all_projects,
  get_all_projects_pagination,
  get_project,
  update_project_status,
};
