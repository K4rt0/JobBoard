// models/category.model.js
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

const create_category = async (data) => {
  try {
    const validatedData = await CATEGORY_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });
    const category = await GET_DB().collection(CATEGORY_COLLECTION_NAME).insertOne(validatedData);

    // Nếu có skills trong data, tạo skills liên quan
    if (data.skills && Array.isArray(data.skills)) {
      const categoryId = category.insertedId; // ObjectId
      const skillsToInsert = data.skills.map((skill) => ({
        ...skill,
        category_id: categoryId,
        created_at: Date.now(),
        updated_at: null,
      }));
      const skillResult = await GET_DB().collection("skills").insertMany(skillsToInsert);
    }

    return category;
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_categories = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const total = await GET_DB().collection(CATEGORY_COLLECTION_NAME).countDocuments();

    const categories = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .aggregate([
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "skills",
            localField: "_id",
            foreignField: "category_id",
            as: "skills",
          },
        },
      ])
      .toArray();

    const totalPages = Math.ceil(total / limit);

    return {
      data: categories,
      pagination: {
        total,
        currentPage: page,
        totalPages,
        limit,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

const find_category_by_id = async (id) => {
  try {
    const category = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "skills",
            localField: "_id",
            foreignField: "category_id",
            as: "skills",
          },
        },
      ])
      .toArray();

    if (!category.length) throw new Error("Category not found");
    return category[0];
  } catch (error) {
    throw new Error(error);
  }
};

const update_category = async (id, data) => {
  try {
    const validatedData = await CATEGORY_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });
    validatedData.updated_at = Date.now();

    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: validatedData });

    if (data.skills && Array.isArray(data.skills)) {
      const skillsToInsert = data.skills.map((skill) => ({
        ...skill,
        category_id: new ObjectId(id),
        created_at: Date.now(),
        updated_at: null,
      }));
      const skillResult = await GET_DB().collection("skills").insertMany(skillsToInsert);
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const delete_category = async (id) => {
  try {
    const skillCount = await GET_DB()
      .collection("skills")
      .countDocuments({ category_id: new ObjectId(id) });
    if (skillCount > 0) {
      throw new Error("Cannot delete category with associated skills");
    }

    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const category_model = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
  create_category,
  find_all_categories,
  find_category_by_id,
  update_category,
  delete_category,
};
