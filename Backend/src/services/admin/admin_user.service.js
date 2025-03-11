import { user_model } from "~/models/user.model";

const get_all_users = async (page = 1, limit = 10, filter = {}) => {
  try {
    const result = await user_model.find_all_with_pagination(page, limit, filter);
    return result;
  } catch (error) {
    throw error;
  }
};

export const admin_user_service = {
  get_all_users,
};
