import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const CATEGORY_COLLECTION_NAME = "categories";
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().strict(),
  description: Joi.string().max(200).default(null),
  slug: Joi.string().trim().strict().default(null),

  created_at: Joi.date().timestamp("javascript").default(Date.now),
  updated_at: Joi.date().timestamp("javascript").default(null),
});

export const category_model = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
};
