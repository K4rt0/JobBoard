import Joi from "joi";

const admin_login_validation = async (req, res, next) => {
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

export default admin_login_validation;
