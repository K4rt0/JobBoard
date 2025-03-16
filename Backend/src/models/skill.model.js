import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const SKILL_COLLECTION_NAME = "skills";
const SKILL_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().strict(),
  description: Joi.string().max(200).default(null),
  slug: Joi.string().trim().strict().default(null),
});

const create_skill = async (data) => {
  try {
    const validated_data = await SKILL_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });

    const skill_data = {
      ...validated_data,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const skill = await GET_DB().collection(SKILL_COLLECTION_NAME).insertOne(skill_data);

    return skill;
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_skills_pagination = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const total = await GET_DB().collection(SKILL_COLLECTION_NAME).countDocuments();

    const skills = await GET_DB()
      .collection(SKILL_COLLECTION_NAME)
      .aggregate([{ $skip: skip }, { $limit: limit }])
      .toArray();

    const totalPages = Math.ceil(total / limit);

    return {
      data: skills,
      pagination: {
        total,
        currentPage: page,
        totalPages,
        limit,
      },
    };
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_skills = async () => {
  try {
    const skills = await GET_DB().collection(SKILL_COLLECTION_NAME).find().toArray();

    return skills;
  } catch (error) {
    throw new Error(error);
  }
};

const update_skill = async (id, data) => {
  try {
    const validated_data = await SKILL_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });

    const skill_data = {
      ...validated_data,
      updated_at: Date.now(),
    };

    await GET_DB()
      .collection(SKILL_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: skill_data });

    return { _id: id };
  } catch (error) {
    throw new Error(error);
  }
};

const delete_skill = async (id) => {
  try {
    return await GET_DB()
      .collection(SKILL_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

const find_skill_by_id = async (id) => {
  const skill = await GET_DB()
    .collection(SKILL_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) });

  return skill;
};

export const skill_model = {
  SKILL_COLLECTION_NAME,
  SKILL_COLLECTION_SCHEMA,
  create_skill,
  find_all_skills,
  find_all_skills_pagination,
  find_skill_by_id,
  update_skill,
  delete_skill,
};
