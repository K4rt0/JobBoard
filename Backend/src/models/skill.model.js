import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const SKILL_COLLECTION_NAME = "skills";
const SKILL_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().strict(),
  is_disabled: Joi.boolean().default(false),
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

const create_many_skills = async (data) => {
  try {
    const validated_data = await Promise.all(data.map((item) => SKILL_COLLECTION_SCHEMA.validateAsync(item, { stripUnknown: true })));

    const skills_data = validated_data.map((skill) => ({
      ...skill,
      created_at: Date.now(),
      updated_at: Date.now(),
    }));

    const result = await GET_DB().collection(SKILL_COLLECTION_NAME).insertMany(skills_data);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_skills_pagination = async (page = 1, limit = 10, filtered = {}) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (filtered.search) query.$or = [{ name: { $regex: filtered.search, $options: "i" } }, { slug: { $regex: filtered.search, $options: "i" } }];

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

    const { sort: __, search: ___, ...final_query } = filtered;
    const total = await GET_DB()
      .collection(SKILL_COLLECTION_NAME)
      .countDocuments({ ...final_query, ...query });

    const skills = await GET_DB()
      .collection(SKILL_COLLECTION_NAME)
      .find({ ...final_query, ...query })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total_pages = Math.ceil(total / limit);

    return {
      data: skills,
      pagination: {
        total,
        current_page: page,
        total_pages,
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
      is_disabled: data.is_disabled,
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

const delete_skill = async (query) => {
  try {
    return await GET_DB().collection(SKILL_COLLECTION_NAME).deleteOne(query);
  } catch (error) {
    throw new Error(error);
  }
};

const find_skill = async (query) => {
  const skill = await GET_DB().collection(SKILL_COLLECTION_NAME).findOne(query);
  return skill;
};

export const skill_model = {
  SKILL_COLLECTION_NAME,
  SKILL_COLLECTION_SCHEMA,
  create_skill,
  create_many_skills,
  find_all_skills,
  find_all_skills_pagination,
  find_skill,
  update_skill,
  delete_skill,
};
