import { ObjectId } from "mongodb";
import { user_model } from "~/models/user.model";

const get_all_users = async (page = 1, limit = 10, filter = {}) => {
  try {
    const result = await user_model.find_all_with_pagination(page, limit, filter);
    return result;
  } catch (error) {
    throw error;
  }
};

const get_user = async (user_id) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });
    if (!user) throw new Error("Không tìm thấy người dùng này trong hệ thống !");

    return user;
  } catch (error) {
    throw error;
  }
};

const update_user_status = async (user_id, status) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });
    if (!user) throw new Error("Không tìm thấy người dùng này trong hệ thống !");
    await user_model.update_user(user_id, { status });
    return { id: user_id, status };
  } catch (error) {
    throw error;
  }
};

export const admin_user_service = {
  get_all_users,
  get_user,
  update_user_status,
};
