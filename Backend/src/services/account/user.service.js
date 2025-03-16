import { user_model } from "~/models/user.model";
import bcrypt from "bcrypt";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

const create_user = async (data) => {
  try {
    const existing_user = await user_model.find_user({ email: data.email });
    if (existing_user) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Người dùng đã tồn tại trong hệ thống !");

    const hashed_password = await bcrypt.hash(data.password, 10);
    const user_data = {
      ...data,
      password: hashed_password,
    };

    const user = await user_model.create_user(user_data);
    return user;
  } catch (error) {
    throw error;
  }
};

const get_user_by_id = async (user_id) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });
    if (!user) throw new Error("Không tìm thấy người dùng này trong hệ thống !");

    const { password, refresh_token, ...userWithoutSensitiveInfo } = user;

    return userWithoutSensitiveInfo;
  } catch (error) {
    throw error;
  }
};

const get_all_users = async () => {
  try {
    const users = await user_model.find_all_users();

    const users_without_sensitive_info = users.map((user) => {
      const { password, refresh_token, ...user_without_sensitive_info } = user;
      return user_without_sensitive_info;
    });

    return users_without_sensitive_info;
  } catch (error) {
    throw error;
  }
};

const get_all_users_pagination = async (page, limit, filterObj) => {
  try {
    const users = await user_model.find_all_with_pagination(page, limit, filterObj);

    const users_without_sensitive_info = users.data.map((user) => {
      const { password, refresh_token, ...user_without_sensitive_info } = user;
      return user_without_sensitive_info;
    });

    return users_without_sensitive_info;
  } catch (error) {
    throw error;
  }
};

const change_user_password = async (user_id, old_password, new_password, retype_new_password) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });
    if (!user) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Không tìm thấy người dùng này trong hệ thống !");

    const is_password_match = await bcrypt.compare(old_password, user.password);
    if (!is_password_match) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Mật khẩu cũ không chính xác !");

    if (new_password !== retype_new_password) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Mật khẩu mới không khớp !");

    const hashed_password = await bcrypt.hash(new_password, 10);
    const result = await user_model.update_user(user_id, { password: hashed_password });

    return result;
  } catch (error) {
    throw error;
  }
};

const update_user = async (user_id, data) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });
    if (!user) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Không tìm thấy người dùng này trong hệ thống !");

    const result = await user_model.update_user(user_id, data);

    return result;
  } catch (error) {
    throw error;
  }
};

export const user_service = {
  create_user,
  get_user_by_id,
  get_all_users,
  get_all_users_pagination,
  change_user_password,
  update_user,
};
