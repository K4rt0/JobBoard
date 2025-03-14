import Joi from "joi";

const create_category = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50).trim().strict(),
    description: Joi.string().max(200),
    skills: Joi.array().items(
      Joi.object({
        name: Joi.string().required().min(2).max(50).trim().strict(),
        description: Joi.string().max(200),
      })
    ),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const get_all_categories = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  });

  try {
    await schema.validateAsync(req.query, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const update_category = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim().strict(),
    description: Joi.string().max(200),
    skills: Joi.array().items(
      Joi.object({
        name: Joi.string().required().min(2).max(50).trim().strict(),
        description: Joi.string().max(200),
      })
    ),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export const category_validation = {
  create_category,
  get_all_categories,
  update_category,
};
