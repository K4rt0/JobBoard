import { user_model } from "~/models/user.model";
import bcrypt from "bcrypt";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { imgur_service } from "~/services/utils/imgur.service";
import { skill_model } from "~/models/skill.model";

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

const get_user = async (user_id) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });
    if (!user) throw new Error("Không tìm thấy người dùng này trong hệ thống !");

    const { password, refresh_token, ...user_without_sensitive_info } = user;

    return user_without_sensitive_info;
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

const get_all_users_pagination = async (page, limit, filtered) => {
  try {
    const users = await user_model.find_all_with_pagination(page, limit, filtered);

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
    const user = await user_model.find_user({ _id: new ObjectId(user_id) }, false);
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

const update_user = async (user_id, data, file) => {
  try {
    const user = await user_model.find_user({ _id: new ObjectId(user_id) });
    if (!user) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Không tìm thấy người dùng này trong hệ thống !");

    let avatar = user.avatar || { url: null, delete_hash: null };
    if (file) {
      if (avatar.url && avatar.delete_hash) await imgur_service.delete_image(avatar.delete_hash);

      const imgur_result = await imgur_service.upload_image(file);
      avatar = {
        url: imgur_result.link,
        delete_hash: imgur_result.delete_hash,
      };
    }
    data.avatar = avatar;

    const result = await user_model.update_user(user_id, data);

    return result;
  } catch (error) {
    throw error;
  }
};

const update_skills = async (user_id, skill_ids) => {
  try {
    const seen = new Set();
    const duplicates = skill_ids.filter((id) => (seen.has(id) ? true : seen.add(id) && false));

    const skills = await skill_model.find_all_skills();
    const skill_ids_set = new Set(skills.map((skill) => skill._id.toString()));
    const invalid_skill_ids = skill_ids.filter((skill_id) => !skill_ids_set.has(skill_id.toString()));

    if (duplicates.length > 0 || invalid_skill_ids.length > 0) throw new ApiError(StatusCodes.BAD_REQUEST, "Đã có lỗi xảy ra khi thêm kỹ năng !");

    const updated_skills = skills
      .filter((skill) => skill_ids.includes(skill._id.toString()))
      .map((skill) => ({
        _id: skill._id,
        is_disabled: skill.is_disabled,
      }));

    return await user_model.update_skills(user_id, updated_skills);
  } catch (error) {
    throw error;
  }
};

const update_socials = async (user_id, socials) => {
  try {
    const result = await user_model.update_user(user_id, { socials });

    return result;
  } catch (error) {
    throw error;
  }
};

export const user_service = {
  create_user,
  get_user,
  get_all_users,
  get_all_users_pagination,
  change_user_password,
  update_user,
  update_skills,
  update_socials,
};
