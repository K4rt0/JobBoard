import "dotenv/config";

export const env = {
  DATABASE_URI: process.env.DATABASE_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  SERVER_HOST: process.env.SERVER_HOST,
  SERVER_PORT: process.env.SERVER_PORT,
  BUILD_ENV: process.env.BUILD_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRES_IN: "1m",
  JWT_REFRESH_EXPIRES_IN: "7d",
};
