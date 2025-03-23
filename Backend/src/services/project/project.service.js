import { ObjectId } from "mongodb";
import { category_model } from "~/models/category.model";
import { project_model } from "~/models/project.model";
import { skill_model } from "~/models/skill.model";
import { user_model } from "~/models/user.model";
import { slugify } from "~/utils/formatters";

const validate_project = async (project_id, protect = true) => {
  try {
    const project = await project_model.find_project({ _id: new ObjectId(project_id) }, protect);
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
    const { page, limit, search, location, salary_min, salary_max, job_type, experience, category_id } = query;

    const filter = {};

    if (search) filter.title = { $regex: search, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (salary_min !== undefined || salary_max !== undefined) {
      if (salary_min !== undefined) filter["salary.min"] = { $gte: Number(salary_min) };
      if (salary_max !== undefined) filter["salary.max"] = { $lte: Number(salary_max) };
      if (salary_min !== undefined && salary_max !== undefined && salary_min > salary_max) {
        throw new Error("Lương tối thiểu phải nhỏ hơn lương tối đa !");
      }
    }
    if (category_id) filter.category_id = category_id;
    if (job_type) {
      const job_type_array = Array.isArray(job_type) ? job_type : [job_type];
      if (job_type_array.length > 0) {
        filter.job_type = { $in: job_type_array };
      }
    }
    if (experience !== undefined) filter.experience = { $lte: experience };

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

const apply_project = async (user_id, project_id) => {
  try {
    const project = await validate_project(project_id, false);
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });

    if (user.cv_url === null) throw new Error("Vui lòng tải lên CV trước khi ứng tuyển !");
    if (project.employer_id.toString() === user_id) throw new Error("Không thể ứng tuyển vào dự án của chính mình !");
    if (project.applicants.some((applicant) => applicant._id.toString() === user_id)) throw new Error("Bạn đã ứng tuyển vào dự án này !");

    const date = Date.now();

    project.applicants.push({
      _id: user._id,
      applied_at: date,
      status: "pending",
    });
    project.updated_at = date;

    user.projects_applied.push({
      _id: project._id,
      applied_at: date,
      expired_at: null,
      status: "pending",
    });

    await user_model.update_user(user_id, { projects_applied: user.projects_applied });
    return await project_model.update_project(project_id, project);
  } catch (error) {
    throw error;
  }
};

const get_all_applicants = async (project_id) => {
  try {
    const project = await validate_project(project_id, false);
    const applicants = project.applicants;

    const all_applicants = await Promise.all(
      applicants.map(async (applicant) => {
        const user = await user_model.find_user({ _id: new ObjectId(applicant._id) });
        return { applicant, user };
      })
    );

    return all_applicants;
  } catch (error) {
    throw error;
  }
};

const get_all_applicants_pagination = async (project_id, page, limit, filtered) => {
  try {
    const project = await validate_project(project_id, false);
    let applicants = project.applicants || [];

    applicants = await Promise.all(
      applicants.map(async (applicant) => {
        const user = await user_model.find_user({ _id: new ObjectId(applicant._id) });
        return { ...applicant, user };
      })
    );
    if (filtered.status && filtered.status !== "all") applicants = applicants.filter((app) => app.status === filtered.status);

    if (filtered.search) {
      const search_term = filtered.search.toLowerCase();
      applicants = applicants.filter((app) => app.user && ((app.user.full_name && app.user.full_name.toLowerCase().includes(search_term)) || (app.user.email && app.user.email.toLowerCase().includes(search_term)) || (app.user.phone_number && app.user.phone_number.includes(search_term))));
    }

    switch (filtered.sort?.toLowerCase()) {
      case "newest":
        applicants.sort((a, b) => b.applied_at - a.applied_at);
        break;
      case "oldest":
        applicants.sort((a, b) => a.applied_at - b.applied_at);
        break;
      default:
        break;
    }

    const total = applicants.length;
    const skip = (page - 1) * limit;
    const paginatedApplicants = applicants.slice(skip, skip + limit);

    return {
      applicants: paginatedApplicants,
      pagination: {
        total,
        current_page: page,
        total_page: Math.ceil(total / limit),
        limit,
      },
    };
  } catch (error) {
    throw error;
  }
};

const update_applicant_status = async (project_id, applicant_id, status) => {
  try {
    const project = await validate_project(project_id, false);
    const applicant = project.applicants.find((app) => app._id.toString() === applicant_id);
    if (!applicant) throw new Error("Người ứng tuyển không tồn tại !");

    const user = await user_model.find_user({ _id: new ObjectId(applicant_id) });
    if (!user) throw new Error("Người dùng không tồn tại !");

    const date = Date.now();
    applicant.status = status;
    applicant.updated_at = date;
    project.updated_at = date;

    if (status === "finished") {
      const applied_project = user.projects_applied.find((p) => p._id.toString() === project_id);
      if (applied_project) {
        applied_project.status = "finished";
        applied_project.finished_at = date;
      }
    }

    await user_model.update_user(applicant_id, {
      projects_applied: user.projects_applied,
    });

    return await project_model.update_project(project_id, project);
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
  apply_project,
  get_all_applicants,
  get_all_applicants_pagination,
  update_applicant_status,
};
