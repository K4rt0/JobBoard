import { user_model } from "~/models/user.model";
import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import { ObjectId } from "mongodb";

const refresh_token = async (refresh_token) => {
  try {
    const decoded = jwt.verify(refresh_token, env.JWT_SECRET);
    const user_id = decoded._id;

    const user = await user_model.find_user({ _id: new ObjectId(user_id) });
    if (!user || user.refresh_token !== refresh_token) {
      throw new Error("Refresh Token không hợp lệ !");
    }

    const newAccessToken = jwt.sign({ _id: user_id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });

    return { accessToken: newAccessToken };
  } catch (error) {
    throw error;
  }
};

export const refresh_token_service = {
  refresh_token,
};
