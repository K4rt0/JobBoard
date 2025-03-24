import Joi from "joi";

// Admin
const admin_login = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required().max(50).trim().strict(),
    password: Joi.string().required().trim().strict(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

// User
const login_user = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email().trim().strict(),
    password: Joi.string().required().trim().strict(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

const refresh_token = async (req, res, next) => {
  const schema = Joi.object({
    refresh_token: Joi.string().required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const auth_validation = {
  // Admin
  admin_login,

  // User
  login_user,
  refresh_token,
};
