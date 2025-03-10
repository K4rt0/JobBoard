import Joi from "joi";
import { GET_DB } from "~/config/mongodb";

const REVIEW_COLLECTION_NAME = "reviews";
const REVIEW_COLLECTION_SCHEMA = Joi.object({
  project_id: Joi.string().hex().length(24).required(),
  freelancer_id: Joi.string().hex().length(24).required(),
  employer_id: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(500).default(null),

  created_at: Joi.date().timestamp("javascript").default(Date.now),
  updated_at: Joi.date().timestamp("javascript").default(null),
});

const create_review = async (data) => {
  try {
    const validatedData = await REVIEW_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });
    const review = await GET_DB().collection(REVIEW_COLLECTION_NAME).insertOne(validatedData);
    return review;
  } catch (error) {
    throw new Error(error);
  }
};

export const review_model = {
  REVIEW_COLLECTION_NAME,
  REVIEW_COLLECTION_SCHEMA,
  create_review,
};
