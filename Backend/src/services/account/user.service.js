import { user_model } from "~/models/user.model";
import bcrypt from "bcrypt";
import { env } from "~/config/environment";
import jwt from "jsonwebtoken";

const create_user = async (data) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user_data = {
      ...data,
      password: hashedPassword,
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new Error("Tài khoản hoặc mật khẩu không hợp lệ !");
    if (user.is_blocked) throw new Error("Tài khoản của bạn đã bị khóa !");
    if (user.is_deleted) throw new Error("Tài khoản của bạn đã bị xóa !");

    const _id = user._id.toString();
    const accessToken = jwt.sign({ _id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
    const refreshToken = jwt.sign({ _id }, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

    await user_model.update_user(_id, { refresh_token: refreshToken });

    return { _id, accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const user_service = {
  create_user,
  login_user,
};
