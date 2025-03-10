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
  role: Joi.string().valid("Freelancer", "Employer", "Admin").default("Freelancer"),

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

const find_user = async (query) => {
  try {
    const user = await GET_DB().collection(USER_COLLECTION_NAME).findOne(query);

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update_user = async (user_id, data) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(user_id) }, { $set: data });
    return result;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

export const user_model = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  create_user,
  find_user,
  update_user,
};
