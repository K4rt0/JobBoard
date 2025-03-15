import { category_model } from "~/models/category.model";
import { slugify } from "~/utils/formatters";

const create_category = async (data) => {
  try {
    data.slug = slugify(data.name);

    return await category_model.create_category(data);
  } catch (error) {
    throw error;
  }
};

const get_all_categories_pagination = async (page = 1, limit = 10) => {
  try {
    return await category_model.find_all_categories_pagination(page, limit);
  } catch (error) {
    throw error;
  }
};

const get_all_categories = async () => {
  try {
    return await category_model.find_all_categories();
  } catch (error) {
    throw error;
  }
};

const get_category_by_id = async (id) => {
  try {
    return await category_model.find_category_by_id(id);
  } catch (error) {
    throw error;
  }
};

const update_category = async (id, data) => {
  try {
    const category = await category_model.find_category_by_id(id);
    if (!category) throw new Error("Danh mục này không tồn tại !");

    data.slug = slugify(data.name);

    return await category_model.update_category(id, data);
  } catch (error) {
    throw error;
  }
};

const delete_category = async (id) => {
  try {
    const category = await category_model.find_category_by_id(id);
    if (!category) throw new Error("Danh mục này không tồn tại !");

    const result = await category_model.delete_category(id);
    if (result.deletedCount === 0) throw new Error("Xóa danh mục thất bại !");
    return { message: "Xóa danh mục thành công !" };
  } catch (error) {
    throw error;
  }
};

export const category_service = {
  create_category,
  get_all_categories,
  get_all_categories_pagination,
  get_category_by_id,
  update_category,
  delete_category,
};
