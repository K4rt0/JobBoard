import { user_model } from "~/models/user.model";
import bcrypt from "bcrypt";
import { env } from "~/config/environment";
import jwt from "jsonwebtoken";
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

const login_user = async ({ email, password }) => {
  try {
    const user = await user_model.find_user({ email });
    if (!user) throw new Error("Không tìm thấy người dùng này trong hệ thống !");

    const is_password_valid = await bcrypt.compare(password, user.password);

    if (!is_password_valid) throw new Error("Tài khoản hoặc mật khẩu không hợp lệ !");

    const _id = user._id.toString();
    const access_token = jwt.sign({ _id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
    const refresh_token = jwt.sign({ _id }, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

    await user_model.update_user(_id, { refresh_token: refresh_token });

    return { _id, access_token, refresh_token };
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
    const users = await user_model.find_all_user();

    const users_without_sensitive_info = users.map((user) => {
      const { password, refresh_token, ...user_without_sensitive_info } = user;
      return user_without_sensitive_info;
    });

    return users_without_sensitive_info;
  } catch (error) {
    throw error;
  }
};

const logout_user = async (user_id) => {
  try {
    await user_model.update_user(user_id, { refresh_token: null });
    return { message: "Đăng xuất thành công !" };
  } catch (error) {
    throw error;
  }
};

export const user_service = {
  create_user,
  login_user,
  logout_user,
  get_user_by_id,
  get_all_users,
};
