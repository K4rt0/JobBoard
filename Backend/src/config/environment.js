import "dotenv/config";

export const env = {
  DATABASE_URI: process.env.DATABASE_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  SERVER_HOST: process.env.SERVER_HOST,
  SERVER_PORT: process.env.SERVER_PORT,
  BUILD_ENV: process.env.BUILD_ENV,
};
