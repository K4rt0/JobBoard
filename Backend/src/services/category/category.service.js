import { category_model } from "~/models/category.model";

const create_category = async (data) => {
  try {
    return await category_model.create_category(data);
  } catch (error) {
    throw error;
  }
};

const get_all_categories = async (page = 1, limit = 10) => {
  try {
    return await category_model.find_all_categories(page, limit);
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
    return await category_model.update_category(id, data);
  } catch (error) {
    throw error;
  }
};

const delete_category = async (id) => {
  try {
    return await category_model.delete_category(id);
  } catch (error) {
    throw error;
  }
};

export const category_service = {
  create_category,
  get_all_categories,
  get_category_by_id,
  update_category,
  delete_category,
};
