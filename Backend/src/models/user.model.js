import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  full_name: Joi.string().required().min(3).max(50).trim().strict(),
  password: Joi.string().required().trim().strict(),
  email: Joi.string().required().email().trim().strict(),
  phone_number: Joi.string().min(10).max(15).trim().strict().default(null),
  birth_date: Joi.date().default(null),
  location: Joi.string().max(50).default(null),
  role: Joi.string().valid("Freelancer", "Employer").default("Freelancer"),

  avatar: Joi.object({
    url: Joi.string().uri().default(null),
    delete_hash: Joi.string().default(null),
  }).default({
    url: null,
    delete_hash: null,
  }),

  projects_finished: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().hex().length(24).required(),
        rating: Joi.number().min(1).max(5).default(null),
      })
    )
    .default([]),

  socials: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(50).default(null),
        icon: Joi.string().default(null),
        url: Joi.string().uri().default(null),
      })
    )
    .default([]),

  bio: Joi.string().max(500).default(null),
  website: Joi.string().uri().default(null),
  education: Joi.string().max(100).default(null),
  experience: Joi.number().min(0).default(0),
  cv_url: Joi.string().uri().default(null),
  skills: Joi.array().items(Joi.string().hex().length(24)).default([]),

  company_name: Joi.string().max(100).default(null),
  company_description: Joi.string().max(500).default(null),

  status: Joi.string().valid("Active", "Deleted", "Blocked").default("Active"),

  refresh_token: Joi.string().default(null),

  created_at: Joi.date().timestamp("javascript").default(Date.now()),
  updated_at: Joi.date().timestamp("javascript").default(null),
});

const create_user = async (data) => {
  try {
    const validatedData = await USER_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });

    const user = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validatedData);
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_users = async (query = {}) => {
  try {
    const users = await GET_DB().collection(USER_COLLECTION_NAME).find(query).toArray();
    return users;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

const find_all_with_pagination = async (page = 1, limit = 10, filtered = {}) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (filtered.role && filtered.role !== "All" && ["Freelancer", "Employer"].includes(filtered.role)) query.role = filtered.role;
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

    const { role: _, sort: __, search: ___, ...final_query } = filtered;

    const total = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .countDocuments({ ...final_query, ...query });
    const projection = { password: 0, refresh_token: 0 };
    const users = await GET_DB()
      .collection(USER_COLLECTION_NAME)
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

const find_user = async (query, protect = true) => {
  try {
    const projection = protect ? { password: 0, refresh_token: 0 } : {};
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne(query, { projection });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update_user = async (user_id, data) => {
  try {
    await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(user_id) }, { $set: data });

    return { _id: user_id };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

const update_skills = async (user_id, skills) => {
  try {
    await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(user_id) }, { $set: { skills: skills } });

    return { _id: user_id };
  } catch (error) {
    throw new Error(`Failed to update user skills: ${error.message}`);
  }
};

export const user_model = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  create_user,
  find_user,
  find_all_with_pagination,
  find_all_users,
  update_user,
  update_skills,
};
