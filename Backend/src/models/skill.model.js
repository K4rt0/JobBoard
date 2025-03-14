import Joi from "joi";
import { GET_DB } from "~/config/mongodb";

const SKILL_COLLECTION_NAME = "skills";
const SKILL_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().strict(),
  description: Joi.string().max(200).default(null),
  slug: Joi.string().trim().strict().default(null),
  category_id: Joi.string().hex().length(24).required(),

  created_at: Joi.date().timestamp("javascript").default(Date.now),
  updated_at: Joi.date().timestamp("javascript").default(null),
});

export const skill_model = {
  SKILL_COLLECTION_NAME,
  SKILL_COLLECTION_SCHEMA,
};
