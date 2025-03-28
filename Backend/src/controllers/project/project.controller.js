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
      category_id: Joi.string().hex().length(24),
      job_type: Joi.alternatives().try(Joi.string().valid("full-time", "part-time", "remote", "internship"), Joi.array().items(Joi.string().valid("full-time", "part-time", "remote", "internship"))),
      experience: Joi.number().min(0),
      status: Joi.string().valid("all", "opening", "closed"),
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

const apply_project = async (req, res, next) => {
  try {
    const result = await project_service.apply_project(req._id, req.params.project_id);

    res.status(StatusCodes.OK).json({
      message: "Ứng tuyển dự án thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_applicants = async (req, res, next) => {
  try {
    const result = await project_service.get_all_applicants(req.params.project_id);

    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách ứng viên thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_applicants_pagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { status, sort, search } = req.query;
    const filtered = {};
    if (status && ["all", "pending", "accepted", "rejected", "finished"].includes(status)) filtered.status = status;
    if (sort && ["all", "oldest", "newest"].includes(sort.toLowerCase())) filtered.sort = sort;
    if (search) filtered.search = search;

    const result = await project_service.get_all_applicants_pagination(req.params.project_id, page, limit, filtered);

    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách ứng viên thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update_applicant_status = async (req, res, next) => {
  try {
    const result = await project_service.update_applicant_status(req.params.project_id, req.params.applicant_id, req.body.status);

    res.status(StatusCodes.OK).json({
      message: "Cập nhật trạng thái ứng viên thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_my_projects = async (req, res, next) => {
  try {
    const result = await project_service.get_all_my_projects(req._id);

    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách dự án của bạn thành công !",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get_all_my_projects_pagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { status, sort, search } = req.query;
    const filtered = {};
    if (status && ["all", "opening", "closed"].includes(status)) filtered.status = status;
    if (sort && ["all", "oldest", "newest"].includes(sort.toLowerCase())) filtered.sort = sort;
    if (search) filtered.search = search;

    const result = await project_service.get_all_my_projects_pagination(req._id, page, limit, filtered);

    res.status(StatusCodes.OK).json({
      message: "Lấy danh sách dự án của bạn thành công !",
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
  get_all_my_projects,
  get_all_projects_pagination,
  get_all_my_projects_pagination,
  get_project,
  update_project_status,
  apply_project,
  get_all_applicants,
  get_all_applicants_pagination,
  update_applicant_status,
};
