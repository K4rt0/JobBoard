import Joi from "joi";

const create_user = async (req, res, next) => {
  const schema = Joi.object({
    full_name: Joi.string().required().min(3).max(50).trim().strict(),
    password: Joi.string().required().trim().strict(),
    email: Joi.string().required().email().trim().strict(),
    phone_number: Joi.string().min(10).max(15).trim().strict().default(null),
    birth_date: Joi.date().default(null),
    role: Joi.string().valid("Freelancer", "Employer", "Admin").default("Freelancer"),

    bio: Joi.string().max(500).default(null),
    education: Joi.string().max(100).default(null),
    experience: Joi.number().min(0).default(0),
    cv_url: Joi.string().uri().default(null),
    skills: Joi.array().items(Joi.string().hex().length(24)).default([]),

    company_name: Joi.string().max(100).default(null),
    company_description: Joi.string().max(500).default(null),

    status: Joi.string().valid("Active", "Deleted", "Blocked").default("Active"),

    refresh_token: Joi.string().default(null),

    created_at: Joi.date().timestamp("javascript").default(Date.now()),
    updated_at: Joi.date().timestamp("javascript").default(null),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

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

const refresh = async (req, res, next) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const user_validation = {
  create_user,
  login_user,
  refresh,
};
