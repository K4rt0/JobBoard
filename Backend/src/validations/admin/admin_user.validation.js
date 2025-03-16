import Joi from "joi";

const get_all_users = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid("Active", "Deleted", "Blocked"),
    role: Joi.string().valid("All", "Freelancer", "Employer"),
    sort: Joi.string().valid("all", "oldest", "newest"),
    search: Joi.string(),
  });
  try {
    await schema.validateAsync(req.query, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const update_user_status = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid("Active", "Deleted", "Blocked").required(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export const admin_user_validation = {
  get_all_users,
  update_user_status,
};
