import "dotenv/config";

export const env = {
  DATABASE_URI: process.env.DATABASE_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  SERVER_HOST: process.env.SERVER_HOST,
  SERVER_PORT: process.env.SERVER_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRES_IN: "1y",
  JWT_REFRESH_EXPIRES_IN: "1y",
  ADMIN_USER: process.env.ADMIN_USER,
  ADMIN_PWD: process.env.ADMIN_PWD,
  IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID,
  IMGUR_CLIENT_SECRET: process.env.IMGUR_CLIENT_SECRET,
};
