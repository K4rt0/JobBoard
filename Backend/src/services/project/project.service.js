import { ObjectId } from "mongodb";
import { category_model } from "~/models/category.model";
import { project_model } from "~/models/project.model";
import { skill_model } from "~/models/skill.model";
import { user_model } from "~/models/user.model";
import { slugify } from "~/utils/formatters";

const validate_project = async (project_id, user_id) => {
  try {
    const project = await project_model.find_project({ _id: new ObjectId(project_id) });
    if (!project) throw new Error("Dự án không tồn tại !");

    return project;
  } catch (error) {
    throw error;
  }
};

const validate_data = async (skills, category_id) => {
  try {
    if (!skills || skills.length === 0) throw new Error("Dự án cần ít nhất một kỹ năng !");
    if (!category_id) throw new Error("Dự án cần một danh mục !");

    const all_skills = await skill_model.find_all_skills();
    const all_categories = await category_model.find_all_categories();

    const skill_ids = skills.map((skill) => {
      const found_skill = all_skills.find((s) => s._id.toString() === skill);
      if (!found_skill) throw new Error("Kỹ năng không tồn tại !");
      return found_skill._id.toString();
    });

    const category = all_categories.find((c) => c._id.toString() === category_id);
    if (!category) throw new Error("Danh mục không tồn tại !");

    return { skill_ids, category_id: category._id.toString() };
  } catch (error) {
    throw error;
  }
};

const create_project = async (user_id, data) => {
  try {
    const { skill_ids } = await validate_data(data.skills, data.category_id);

    data.employer_id = user_id;
    data.skills = skill_ids;
    data.slug = slugify(data.title);

    return await project_model.create_project(data);
  } catch (error) {
    throw error;
  }
};

const update_project = async (project_id, data) => {
  try {
    await validate_project(project_id);
    await validate_data(data.skills, data.category_id);

    const user = await user_model.find_user({ _id: new ObjectId(data.employer_id) });
    if (!user) throw new Error("Người dùng không tồn tại !");

    if (data.title) data.slug = slugify(data.title);

    data.updated_at = new Date();

    return await project_model.update_project(project_id, data);
  } catch (error) {
    throw error;
  }
};

const get_all_projects = async () => {
  try {
    return await project_model.find_all_projects();
  } catch (error) {
    throw error;
  }
};

const get_all_projects_pagination = async (query) => {
  try {
    const { page, limit, search, location, salary_min, salary_max, job_type, experience } = query;

    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (salary_min !== undefined || salary_max !== undefined) {
      filter.salary = {};
      if (salary_min !== undefined) filter.salary.$gte = salary_min;
      if (salary_max !== undefined) filter.salary.$lte = salary_max;
    }
    if (job_type && job_type.length > 0) {
      filter.job_type = { $in: job_type };
    }
    if (experience !== undefined) {
      filter.experience = { $gte: experience };
    }

    const projects = await project_model.find_all_projects_pagination(page, limit, filter);

    return projects;
  } catch (error) {
    throw error;
  }
};

const get_project = async (project_id, protect = true) => {
  try {
    return await project_model.find_project({ _id: new ObjectId(project_id) }, protect);
  } catch (error) {
    throw error;
  }
};

const update_project_status = async (project_id, project_status) => {
  try {
    await validate_project(project_id);

    return await project_model.update_project(project_id, { status: project_status });
  } catch (error) {
    throw error;
  }
};

export const project_service = {
  create_project,
  update_project,
  get_all_projects,
  get_all_projects_pagination,
  update_project_status,
  get_project,
};
