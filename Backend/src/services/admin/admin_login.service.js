import { env } from "~/config/environment";
import jwt from "jsonwebtoken";

const admin_login_service = (data) => {
  try {
    const username = env.ADMIN_USER;
    const password = env.ADMIN_PWD;

    if (data.username !== username || data.password !== password) throw new Error("Tài khoản hoặc mật khẩu không hợp lệ !");

    const accessToken = jwt.sign({}, env.JWT_SECRET, { expiresIn: "1h" });
    return { accessToken };
  } catch (error) {
    throw error;
  }
};

export default admin_login_service;
