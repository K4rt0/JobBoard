import Joi from "joi";
import { GET_DB } from "~/config/mongodb";

const SKILL_COLLECTION_NAME = "skills";
const SKILL_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().strict(),
  description: Joi.string().max(200).default(null),
  slug: Joi.string().trim().strict().default(null),

  created_at: Joi.date().timestamp("javascript").default(Date.now),
  updated_at: Joi.date().timestamp("javascript").default(null),
});

const create_skills = async (skills) => {
  try {
    const validated_skills = await Promise.all(skills.map((skill) => SKILL_COLLECTION_SCHEMA.validateAsync(skill, { stripUnknown: true })));
    const result = await GET_DB().collection(SKILL_COLLECTION_NAME).insertMany(validated_skills);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const skill_model = {
  SKILL_COLLECTION_NAME,
  SKILL_COLLECTION_SCHEMA,
  create_skills,
};
