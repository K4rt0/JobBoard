import Joi from "joi";

const create_user = async (req, res, next) => {
  const schema = Joi.object({
    full_name: Joi.string().required().min(3).max(50).trim().strict(),
    password: Joi.string().required().trim().strict(),
    email: Joi.string().required().email().trim().strict(),
    phone_number: Joi.string().min(10).max(15).trim().strict().default(null),
    birth_date: Joi.date().default(null),
    location: Joi.string().max(50).default(null),
    role: Joi.string().valid("Freelancer", "Employer").default("Freelancer"),

    avatar: Joi.object({
      url: Joi.string().uri().default(null),
      delete_hash: Joi.string().default(null),
    }).default({
      url: null,
      delete_hash: null,
    }),

    socials: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().max(50).default(null),
          icon: Joi.string().default(null),
          url: Joi.string().uri().default(null),
        })
      )
      .default([]),

    projects_applied: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string().hex().length(24).required(),
          applied_at: Joi.date().timestamp("javascript").default(Date.now),
          expired_at: Joi.date().timestamp("javascript").default(null),
          status: Joi.string().valid("pending", "accepted", "rejected", "finished").default("pending"),
        })
      )
      .default([]),

    bio: Joi.string().max(500).default(null),
    website: Joi.string().uri().default(null),
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

const get_all_users_pagination = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid("Active", "Deleted", "Blocked"),
    role: Joi.string().valid("All", "Freelancer", "Employer"),
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

const change_user_password = async (req, res, next) => {
  const schema = Joi.object({
    old_password: Joi.string().required().trim().strict(),
    new_password: Joi.string().required().trim().strict(),
    retype_new_password: Joi.string().required().trim().strict(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const update_user = async (req, res, next) => {
  const schema = Joi.object({
    full_name: Joi.string().min(3).max(50).trim().strict().messages({
      "string.base": "Họ và tên phải là chuỗi !",
      "string.empty": "Họ và tên không được để trống !",
      "string.min": "Họ và tên phải có ít nhất {#limit} ký tự !",
      "string.max": "Họ và tên không được vượt quá {#limit} ký tự !",
    }),
    phone_number: Joi.string().min(10).max(15).trim().strict().default(null).messages({
      "string.base": "Số điện thoại phải là chuỗi !",
      "string.min": "Số điện thoại phải có ít nhất {#limit} ký tự !",
      "string.max": "Số điện thoại không được vượt quá {#limit} ký tự !",
    }),
    birth_date: Joi.date().default(null).messages({
      "date.base": "Ngày sinh không hợp lệ !",
    }),

    avatar: Joi.object({
      url: Joi.string().uri().default(null),
      delete_hash: Joi.string().default(null),
    })
      .default({ url: null, delete_hash: null })
      .messages({
        "object.base": "Avatar phải là object !",
      }),
    bio: Joi.string().max(500).default(null).messages({
      "string.max": "Bio không được vượt quá {#limit} ký tự !",
    }),
    education: Joi.string().max(100).default(null).messages({
      "string.max": "Học vấn không được vượt quá {#limit} ký tự !",
    }),
    experience: Joi.string().default(null),
    cv_url: Joi.string().uri().default(null).messages({
      "string.uri": "CV URL không hợp lệ !",
    }),
    skills: Joi.array().items(Joi.string().hex().length(24)).default([]).messages({
      "array.items": "Mã kỹ năng phải là mảng chuỗi hex 24 ký tự !",
    }),
    website: Joi.string().uri().default(null).messages({
      "string.uri": "Website không hợp lệ !",
    }),

    company_name: Joi.string().max(100).default(null).messages({
      "string.max": "Company name không được vượt quá {#limit} ký tự !",
    }),
    company_description: Joi.string().max(500).default(null).messages({
      "string.max": "Company description không được vượt quá {#limit} ký tự !",
    }),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const update_skills = async (req, res, next) => {
  const schema = Joi.object({
    skills: Joi.array().items(Joi.string().hex().length(24).required()).required(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const update_socials = async (req, res, next) => {
  const schema = Joi.object({
    socials: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().max(50).required(),
          icon: Joi.string().required(),
          url: Joi.string().uri().required(),
        })
      )
      .required(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const get_all_projects_pagination = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid("all", "oldest", "newest"),
    status: Joi.string().valid("all", "pending", "accepted", "rejected", "finished"),
    search: Joi.string().allow(""),
  });
  try {
    await schema.validateAsync(req.query, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export const user_validation = {
  create_user,
  get_all_users_pagination,
  update_user_status,
  change_user_password,
  update_user,
  update_skills,
  update_socials,
  get_all_projects_pagination,
};
