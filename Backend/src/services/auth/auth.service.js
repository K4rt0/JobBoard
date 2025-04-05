import { user_model } from "~/models/user.model";
import bcrypt from "bcrypt";
import { env } from "~/config/environment";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import axios from "axios";

// Admin
const admin_login = (data) => {
  try {
    const username = env.ADMIN_USER;
    const password = env.ADMIN_PWD;

    if (data.username !== username || data.password !== password) throw new Error("Tài khoản hoặc mật khẩu không hợp lệ !");

    const access_token = jwt.sign({}, env.JWT_SECRET, { expiresIn: "7d" });
    return { access_token };
  } catch (error) {
    throw error;
  }
};

// User
const login_user = async ({ email, password }) => {
  try {
    const user = await user_model.find_user({ email }, false);
    if (!user) throw new Error("Không tìm thấy người dùng này trong hệ thống !");
    const is_password_valid = await bcrypt.compare(password, user.password);

    if (!is_password_valid) throw new Error("Tài khoản hoặc mật khẩu không hợp lệ !");

    if (user.status === "Deleted" || user.status === "Blocked") throw new ApiError(StatusCodes.FORBIDDEN, `Tài khoản này đã ${user.status === "Deleted" ? "bị xóa" : "bị khóa"} !`);

    const _id = user._id.toString();
    const access_token = jwt.sign({ _id, role: user.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
    const refresh_token = jwt.sign({ _id }, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    await user_model.update_user(_id, { refresh_token: refresh_token });

    return { _id, access_token, refresh_token };
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

const refresh_token = async (refresh_token) => {
  try {
    const decoded = jwt.verify(refresh_token, env.JWT_SECRET);
    const user_id = decoded._id;

    const user = await user_model.find_user({ _id: new ObjectId(user_id) }, false);
    if (!user || user.refresh_token !== refresh_token) throw new Error("Refresh Token không hợp lệ !");

    const new_access_token = jwt.sign({ _id: user_id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });

    return { access_token: new_access_token };
  } catch (error) {
    throw error;
  }
};

const google_login_user = async (id_token) => {
  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });
    const { email, name } = response.data;

    let user = await user_model.find_user({ email }, false);

    if (!user) {
      const hashed_password = await bcrypt.hash(email, 10);
      user = await user_model.create_user({
        email,
        full_name: name,
        password: hashed_password,
      });
      user = await user_model.find_user({ email }, false);
    }

    if (user.status === "Deleted" || user.status === "Blocked") throw new ApiError(StatusCodes.FORBIDDEN, `Tài khoản này đã ${user.status === "Deleted" ? "bị xóa" : "bị khóa"} !`);

    const _id = user._id.toString();
    const access_token = jwt.sign({ _id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
    const refresh_token = jwt.sign({ _id }, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

    await user_model.update_user(_id, { refresh_token: refresh_token });

    return { _id, access_token, refresh_token };
  } catch (error) {
    throw error;
  }
};

export const auth_service = {
  // Admin
  admin_login,

  // User
  login_user,
  logout_user,
  google_login_user,
  refresh_token,
};
