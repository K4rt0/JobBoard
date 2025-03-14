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

const update_user_status = async (user_Id, status) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(user_Id) });
    if (!user) throw new Error("Không tìm thấy người dùng này trong hệ thống !");
    await user_model.update_user(user_Id, { status });
    return { id: user_Id, status };
  } catch (error) {
    throw error;
  }
};

export const admin_user_service = {
  get_all_users,
  update_user_status,
};
