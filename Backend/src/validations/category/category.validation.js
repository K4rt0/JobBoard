import Joi from "joi";

const create_category = async (req, res, next) => {
  const single_schema = Joi.object({
    name: Joi.string().required().max(50).trim().strict(),
    description: Joi.string().max(200),
  });
  const multiple_schema = Joi.array().items(single_schema);
  const schema = Joi.alternatives().try(single_schema, multiple_schema);

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const get_all_categories_pagination = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid("all", "oldest", "newest"),
    search: Joi.string().allow(""),
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
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const delete_category = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required(),
  });
  try {
    await schema.validateAsync(req.params);
    next();
  } catch (error) {
    next(error);
  }
};

export const category_validation = {
  create_category,
  get_all_categories_pagination,
  update_category,
  delete_category,
};
