import { skill_model } from "~/models/skill.model";
import { slugify } from "~/utils/formatters";

const create_skill = async (data) => {
  try {
    if (Array.isArray(data)) {
      const skills = data.map((skill) => ({
        ...skill,
        slug: slugify(skill.name),
      }));
      return await skill_model.create_many_skills(skills);
    }
    data.slug = slugify(data.name);
    return await skill_model.create_skill(data);
  } catch (error) {
    throw error;
  }
};

const get_all_skills_pagination = async (page = 1, limit = 10, filtered) => {
  try {
    return await skill_model.find_all_skills_pagination(page, limit, filtered);
  } catch (error) {
    throw error;
  }
};

const get_all_skills = async () => {
  try {
    return await skill_model.find_all_skills();
  } catch (error) {
    throw error;
  }
};

const get_skill_by_id = async (id) => {
  try {
    const skill = await skill_model.find_skill_by_id(id);
    if (!skill) throw new Error("Kỹ năng này không tồn tại !");

    return await skill_model.find_skill_by_id(id);
  } catch (error) {
    throw error;
  }
};

const update_skill = async (id, data) => {
  try {
    const skill = await skill_model.find_skill_by_id(id);
    if (!skill) throw new Error("Kỹ năng này không tồn tại !");

    data.slug = slugify(data.name);

    return await skill_model.update_skill(id, data);
  } catch (error) {
    throw error;
  }
};

const delete_skill = async (id) => {
  try {
    const skill = await skill_model.find_skill_by_id(id);
    if (!skill) throw new Error("Kỹ năng này không tồn tại !");

    const result = await skill_model.delete_skill(id);
    if (result.deletedCount === 0) throw new Error("Xóa kỹ năng thất bại !");
    return { message: "Xóa kỹ năng thành công !" };
  } catch (error) {
    throw error;
  }
};

export const skill_service = {
  create_skill,
  get_all_skills,
  get_all_skills_pagination,
  get_skill_by_id,
  update_skill,
  delete_skill,
};
