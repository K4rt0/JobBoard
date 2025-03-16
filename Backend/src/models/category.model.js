import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const CATEGORY_COLLECTION_NAME = "categories";
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().strict(),
  description: Joi.string().max(200).default(""),
  slug: Joi.string().trim().strict().default(null),
});

const create_category = async (data) => {
  try {
    const validated_data = await CATEGORY_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });

    const category_data = {
      ...validated_data,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const category = await GET_DB().collection(CATEGORY_COLLECTION_NAME).insertOne(category_data);

    return category;
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_categories_pagination = async (page = 1, limit = 10) => {
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

const find_all_categories = async () => {
  try {
    const categories = await GET_DB().collection(CATEGORY_COLLECTION_NAME).find().toArray();

    return categories;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

const update_category = async (id, data) => {
  try {
    const validated_data = await CATEGORY_COLLECTION_SCHEMA.validateAsync(data, {
      stripUnknown: true,
    });

    const category_data = {
      ...validated_data,
      updated_at: Date.now(),
    };

    await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: category_data });

    return { _id: id };
  } catch (error) {
    throw new Error(error);
  }
};

const delete_category = async (id) => {
  try {
    return await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

const find_category_by_id = async (id) => {
  const category = await GET_DB()
    .collection(CATEGORY_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) });

  return category;
};

export const category_model = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
  create_category,
  find_all_categories,
  find_all_categories_pagination,
  find_category_by_id,
  update_category,
  delete_category,
};
