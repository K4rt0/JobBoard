import Joi from "joi";

const create_project = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).trim().strict().required(),
    salary: Joi.object({
      min: Joi.number().min(0).required(),
      max: Joi.number().min(0).required(),
    })
      .required()
      .custom((value, helpers) => {
        if (value.min > value.max)
          return helpers.message("Lương tối thiểu phải nhỏ hơn lương tối đa !");
        return value;
      }),
    location: Joi.string().max(50).required(),
    description: Joi.string().max(1000).trim().strict().required(),
    expired_at: Joi.date().timestamp("javascript").required(),

    category_id: Joi.string().hex().length(24).required(),

    quantity: Joi.number().min(1).required(),
    skills: Joi.array().items(Joi.string().hex().length(24)).required(),
    experience: Joi.number().min(0).required(),
    gender: Joi.string().valid("Male", "Female", "Any").default("Male"),

    requirements: Joi.array()
      .items(Joi.string().required().max(1000).trim().strict())
      .default([]),
    benefits: Joi.array()
      .items(Joi.string().required().max(1000).trim().strict())
      .default([]),

    contact: Joi.object({
      full_name: Joi.string().max(100).required(),
      email: Joi.string().email().required(),
      phone_number: Joi.string().min(10).max(15).required(),
    }).required(),

    job_type: Joi.array()
      .items(
        Joi.string().valid("full-time", "part-time", "remote", "internship"),
      )
      .default(["full-time"]),
    status: Joi.string().valid("opening", "closed").default("opening"),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const update_project = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).trim().strict(),
    salary: Joi.object({
      min: Joi.number().min(0).required(),
      max: Joi.number().min(0).required(),
    })
      .required()
      .custom((value, helpers) => {
        if (value.min > value.max)
          return helpers.message("Lương tối thiểu phải nhỏ hơn lương tối đa !");
        return value;
      }),
    location: Joi.string().max(50),
    description: Joi.string().max(1000).trim().strict().required(),
    expired_at: Joi.date().timestamp("javascript").required(),

    employer_id: Joi.string().hex().length(24).required(),
    category_id: Joi.string().hex().length(24).required(),

    quantity: Joi.number().min(1),
    skills: Joi.array().items(Joi.string().hex().length(24)),
    experience: Joi.number().min(0),

    requirements: Joi.array().items(Joi.string().max(1000).trim().strict()),
    benefits: Joi.array().items(Joi.string().max(1000).trim().strict()),
    contact: Joi.object({
      full_name: Joi.string().max(100),
      email: Joi.string().email(),
      phone_number: Joi.string().min(10).max(15),
    }),

    job_type: Joi.array().items(
      Joi.string().valid("full-time", "part-time", "remote", "internship"),
    ),
    status: Joi.string().valid("opening", "closed"),
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
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10),
    search: Joi.string().default(""),
    location: Joi.string().max(50),
    salary_min: Joi.number().min(0),
    salary_max: Joi.number().min(0),
    category_id: Joi.string().hex().length(24),
    job_type: Joi.alternatives().try(
      Joi.string().valid("full-time", "part-time", "remote", "internship"),
      Joi.array().items(
        Joi.string().valid("full-time", "part-time", "remote", "internship"),
      ),
    ),
    experience: Joi.number().min(0),
    status: Joi.string().valid("all", "opening", "closed"),
  });

  try {
    await schema.validateAsync(req.query, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const get_project = async (req, res, next) => {
  const schema = Joi.object({
    project_id: Joi.string().hex().length(24).required(),
  });

  try {
    await schema.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const update_project_status = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid("opening", "closed").required(),
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const apply_project = async (req, res, next) => {
  const schema = Joi.object({
    project_id: Joi.string().hex().length(24).required(),
  });

  try {
    await schema.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const get_all_applicants = async (req, res, next) => {
  const schema = Joi.object({
    project_id: Joi.string().hex().length(24).required(),
  });

  try {
    await schema.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const get_all_applicants_pagination = async (req, res, next) => {
  const schema = Joi.object({
    project_id: Joi.string().hex().length(24).required(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10),
    sort: Joi.string().valid("all", "oldest", "newest"),
    search: Joi.string().default(""),
    status: Joi.string().valid(
      "all",
      "pending",
      "accepted",
      "rejected",
      "finished",
    ),
  });

  try {
    await schema.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

const update_applicant_status = async (req, res, next) => {
  const schema = Joi.object({
    project_id: Joi.string().hex().length(24).required(),
    applicant_id: Joi.string().hex().length(24).required(),
    status: Joi.string()
      .valid("pending", "accepted", "rejected", "finished")
      .required(),
  });

  try {
    await schema.validateAsync(
      { ...req.params, ...req.body },
      { abortEarly: false },
    );
    next();
  } catch (error) {
    next(error);
  }
};

const get_all_my_projects_pagination = async (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).default(10),
    sort: Joi.string().valid("all", "oldest", "newest"),
    status: Joi.string().valid("all", "opening", "closed"),
    search: Joi.string().default(""),
  });

  try {
    await schema.validateAsync(req.query, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};

export const project_validation = {
  create_project,
  update_project,
  get_all_projects_pagination,
  get_all_my_projects_pagination,
  get_project,
  update_project_status,
  apply_project,
  get_all_applicants,
  get_all_applicants_pagination,
  update_applicant_status,
};
