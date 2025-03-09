import ApiError from "~/utils/ApiError";

const createExample = (req, res, next) => {
  try {
    throw new ApiError(500, "hello");
  } catch (error) {
    next(error);
  }
};

export const exampleController = {
  createExample,
};
