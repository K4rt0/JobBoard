import Joi from "joi";
import { GET_DB } from "~/config/mongodb";

const PROJECT_COLLECTION_NAME = "projects";
const PROJECT_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(100).trim().strict(),
  description: Joi.string().required().max(1000).trim().strict(),
  employer_id: Joi.string().hex().length(24).required(),
  required_skills: Joi.array().items(Joi.string().hex().length(24)).default([]),
  experience: Joi.number().min(0).required(),
  education: Joi.string().max(100).required(),
  location: Joi.string().max(50).required(),
  status: Joi.string().valid("open", "in-progress", "completed", "closed").default("open"),
  slug: Joi.string().trim().strict().default(null),

  applicants: Joi.array()
    .items(
      Joi.object({
        freelancer_id: Joi.string().hex().length(24).required(),
        applied_at: Joi.date().timestamp("javascript").default(Date.now),
        status: Joi.string().valid("pending", "accepted", "rejected").default("pending"),
      })
    )
    .default([]),

  assigned_freelancer: Joi.string().hex().length(24).default(null),

  created_at: Joi.date().timestamp("javascript").default(Date.now),
  updated_at: Joi.date().timestamp("javascript").default(null),
});

const create_project = async (data) => {
  try {
    const validatedData = await PROJECT_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });
    const project = await GET_DB().collection(PROJECT_COLLECTION_NAME).insertOne(validatedData);
    return project;
  } catch (error) {
    throw new Error(error);
  }
};

export const project_model = {
  PROJECT_COLLECTION_NAME,
  PROJECT_COLLECTION_SCHEMA,
  create_project,
};
