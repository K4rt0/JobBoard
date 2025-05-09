import { env } from "~/config/environment";

export const error_handling_middleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;

  const response_error = {
    error: {
      status_code: err.statusCode,
      message: err.message,
      stack: err.stack,
    },
  };

  if (env.BUILD_MODE === "production") delete response_error.stack;

  res.status(err.statusCode).json(response_error);
};
