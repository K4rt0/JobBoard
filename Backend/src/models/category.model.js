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
    const validated_data = await CATEGORY_COLLECTION_SCHEMA.validateAsync(
      data,
      {
        stripUnknown: true,
      },
    );

    const category_data = {
      ...validated_data,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const category = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .insertOne(category_data);

    return category;
  } catch (error) {
    throw new Error(error);
  }
};

const create_many_categories = async (data) => {
  try {
    const validated_data = await Promise.all(
      data.map((item) =>
        CATEGORY_COLLECTION_SCHEMA.validateAsync(item, { stripUnknown: true }),
      ),
    );

    const categories_data = validated_data.map((category) => ({
      ...category,
      created_at: Date.now(),
      updated_at: Date.now(),
    }));

    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .insertMany(categories_data);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const find_all_categories_pagination = async (
  page = 1,
  limit = 10,
  filtered = {},
) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (filtered.search)
      query.$or = [
        { name: { $regex: filtered.search, $options: "i" } },
        { slug: { $regex: filtered.search, $options: "i" } },
      ];

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
      .collection(CATEGORY_COLLECTION_NAME)
      .countDocuments({ ...final_query, ...query });

    const categories = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .find({ ...final_query, ...query })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total_pages = Math.ceil(total / limit);

    return {
      data: categories,
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

const find_all_categories = async () => {
  try {
    const categories = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .find()
      .toArray();

    return categories;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

const find_category = async (query) => {
  const category = await GET_DB()
    .collection(CATEGORY_COLLECTION_NAME)
    .findOne(query);
  return category;
};

const update_category = async (id, data) => {
  try {
    const validated_data = await CATEGORY_COLLECTION_SCHEMA.validateAsync(
      data,
      {
        stripUnknown: true,
      },
    );

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

const delete_category = async (query) => {
  try {
    return await GET_DB().collection(CATEGORY_COLLECTION_NAME).deleteOne(query);
  } catch (error) {
    throw new Error(error);
  }
};

export const category_model = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
  create_category,
  create_many_categories,
  find_all_categories,
  find_all_categories_pagination,
  find_category,
  update_category,
  delete_category,
};
