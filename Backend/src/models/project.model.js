import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const PROJECT_COLLECTION_NAME = "projects";
const PROJECT_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(100).trim().strict(),
  salary: Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(0).required(),
  })
    .required()
    .custom((value, helpers) => {
      if (value.min > value.max) return helpers.message("Lương tối thiểu phải nhỏ hơn lương tối đa !");
      return value;
    }),
  location: Joi.string().max(50).required(),
  description: Joi.string().required().max(1000).trim().strict(),
  expired_at: Joi.date().timestamp("javascript").required(),

  category_id: Joi.string().hex().length(24).required(),
  employer_id: Joi.string().hex().length(24).required(),

  quantity: Joi.number().min(1).required(),
  skills: Joi.array().items(Joi.string().hex().length(24)).required(),
  experience: Joi.number().min(0).required(),
  gender: Joi.string().valid("Male", "Female", "Any").default("Male"),

  job_type: Joi.alternatives().try(Joi.string().valid("full-time", "part-time", "remote", "internship"), Joi.array().items(Joi.string().valid("full-time", "part-time", "remote", "internship"))),
  status: Joi.string().valid("opening", "closed").default("opening"),
  slug: Joi.string().trim().strict().default(null),

  requirements: Joi.array().items(Joi.string().required().max(1000).trim().strict()).required(),
  benefits: Joi.array().items(Joi.string().required().max(1000).trim().strict()).required(),

  contact: Joi.object({
    full_name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().min(10).max(15).required(),
  }).required(),

  applicants: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().hex().length(24).required(),
        applied_at: Joi.date().timestamp("javascript").default(Date.now),
        status: Joi.string().valid("pending", "accepted", "rejected").default("pending"),
      })
    )
    .default([]),
});

const create_project = async (data) => {
  try {
    const validated_data = await PROJECT_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });

    validated_data.created_at = Date.now();
    validated_data.updated_at = null;

    const project = await GET_DB().collection(PROJECT_COLLECTION_NAME).insertOne(validated_data);
    return project;
  } catch (error) {
    throw new Error(error);
  }
};

const find_project = async (query, protect = true) => {
  try {
    const projection = protect ? { applicants: 0 } : {};
    const project = await GET_DB().collection(PROJECT_COLLECTION_NAME).findOne(query, { projection });
    return project;
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_projects = async (protect = true) => {
  try {
    const projection = !protect ? { applicants: 0 } : {};
    const projects = await GET_DB().collection(PROJECT_COLLECTION_NAME).find({}, { projection }).toArray();
    return projects;
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_projects_pagination = async (page = 1, limit = 10, filtered = {}) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (filtered.status && filtered.status !== "all" && ["active", "deleted", "blocked"].includes(filtered.status)) query.status = filtered.status;
    if (filtered.search) query.$or = [{ full_name: { $regex: filtered.search, $options: "i" } }, { email: { $regex: filtered.search, $options: "i" } }, { phone_number: { $regex: filtered.search, $options: "i" } }];

    let sort = {};
    const sort_type = filtered.sort || "all";
    switch (sort_type.toLowerCase()) {
      case "newest":
        sort = { created_at: -1 };
        break;
      case "oldest":
        sort = { created_at: 1 };
        break;
      case "all":
      default:
        sort = {};
        break;
    }

    const { status: _, sort: __, search: ___, ...final_query } = filtered;

    const total = await GET_DB()
      .collection(PROJECT_COLLECTION_NAME)
      .countDocuments({ ...final_query, ...query });
    const projection = { password: 0, refresh_token: 0 };
    const users = await GET_DB()
      .collection(PROJECT_COLLECTION_NAME)
      .find({ ...final_query, ...query }, { projection })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total_page = Math.ceil(total / limit);

    return {
      data: users,
      pagination: {
        total,
        current_page: page,
        total_page,
        limit,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

const update_project = async (project_id, data) => {
  try {
    data.updated_at = Date.now();

    const updated_project = await GET_DB()
      .collection(PROJECT_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(project_id) }, { $set: data });

    return updated_project;
  } catch (error) {
    throw new Error(error);
  }
};

const delete_project = async (project_id) => {
  try {
    const project = await find_project({ _id: project_id });
    if (!project) throw new Error("Dự án không tồn tại !");

    const deleted_project = await GET_DB().collection(PROJECT_COLLECTION_NAME).deleteOne({ _id: project_id });
    return deleted_project;
  } catch (error) {
    throw new Error(error);
  }
};

export const project_model = {
  PROJECT_COLLECTION_NAME,
  PROJECT_COLLECTION_SCHEMA,
  create_project,
  find_project,
  find_all_projects,
  update_project,
  delete_project,
  find_all_projects_pagination,
};
