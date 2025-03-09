import Joi from "joi";

const createExample = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(30).trim().strict(),
    description: Joi.string().required().min(3).max(255).trim().strict(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const exampleValidation = {
  createExample,
};
