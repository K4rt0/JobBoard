import "dotenv/config";

export const env = {
  DATABASE_URI: process.env.DATABASE_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  SERVER_HOST: process.env.SERVER_HOST,
  SERVER_PORT: process.env.SERVER_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRES_IN: "1h",
  JWT_REFRESH_EXPIRES_IN: "7d",
  ADMIN_USER: process.env.ADMIN_USER,
  ADMIN_PWD: process.env.ADMIN_PWD,
};
