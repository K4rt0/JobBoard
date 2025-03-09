import { env } from "~/config/environment";

export const exampleMiddleware = (err, req, res, next) => {
  console.log(err.stack);
  if (!err.statusCode) err.statusCode = 500;

  const responseError = {
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  };

  console.log(env.BUILD_ENV);
  if (env.BUILD_ENV === "production") delete responseError.stack;

  res.json(responseError);
};
