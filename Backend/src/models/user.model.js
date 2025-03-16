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
  role: Joi.string().valid("Freelancer", "Employer").default("Freelancer"),

  avatar_url: Joi.string().uri().default(null),
  bio: Joi.string().max(500).default(null),
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

const find_all_users = async () => {
  try {
    const users = await GET_DB().collection(USER_COLLECTION_NAME).find({}).toArray();
    return users;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

const find_all_with_pagination = async (page = 1, limit = 10, filter = {}) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (filter.role && filter.role !== "All" && ["Freelancer", "Employer"].includes(filter.role)) query.role = filter.role;
    if (filter.search) query.$or = [{ full_name: { $regex: filter.search, $options: "i" } }, { email: { $regex: filter.search, $options: "i" } }, { phone_number: { $regex: filter.search, $options: "i" } }];

    let sort = {};
    const sort_type = filter.sort || "all";
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

    const { role: _, sort: __, search: ___, ...final_query } = filter;

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
    console.log(data);
    await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(user_id) }, { $set: data });

    return { _id: user_id };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
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
};
