import { ObjectId } from "mongodb";
import { skill_model } from "~/models/skill.model";
import { user_model } from "~/models/user.model";
import { slugify } from "~/utils/formatters";

const create_skill = async (data) => {
  try {
    if (Array.isArray(data)) {
      const skills = data.map((skill) => ({
        ...skill,
        is_disabled: skill.is_disabled !== undefined ? skill.is_disabled : false,
        slug: slugify(skill.name),
      }));
      for (const skill of skills) {
        const existing_skill = await skill_model.find_skill({ name: skill.name });
        if (existing_skill) throw new Error(`Kỹ năng ${skill.name} đã tồn tại!`);
      }
      return await skill_model.create_many_skills(skills);
    }
    const existing_skill = await skill_model.find_skill({ name: data.name });
    if (existing_skill) throw new Error(`Kỹ năng ${data.name} đã tồn tại!`);
    data.is_disabled = data.is_disabled !== undefined ? data.is_disabled : false;
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

const get_skill = async (id) => {
  try {
    const skill = await skill_model.find_skill({ _id: new ObjectId(id) });
    if (!skill) throw new Error("Kỹ năng này không tồn tại !");

    return skill;
  } catch (error) {
    throw error;
  }
};

const update_skill = async (id, data) => {
  try {
    const skill = await skill_model.find_skill({ _id: new ObjectId(id) });
    if (!skill) throw new Error("Kỹ năng này không tồn tại !");

    data.is_disabled = data.is_disabled !== undefined ? data.is_disabled : skill.is_disabled;
    data.slug = slugify(data.name);

    if (data.is_disabled !== skill.is_disabled) {
      const users_with_skill = await user_model.find_all_users({ skills: { $elemMatch: { _id: new ObjectId(id) } } });
      for (const user of users_with_skill) {
        const skill_in_user = user.skills.find((s) => s._id.toString() === id);
        if (skill_in_user && skill_in_user.is_disabled !== data.is_disabled) {
          skill_in_user.is_disabled = data.is_disabled;
          await user_model.update_user(user._id, { skills: user.skills });
        }
      }
    }

    return await skill_model.update_skill(id, data);
  } catch (error) {
    throw error;
  }
};

const delete_skill = async (id) => {
  try {
    const skill = await skill_model.find_skill({ _id: new ObjectId(id) });
    if (!skill) throw new Error("Kỹ năng này không tồn tại !");

    const users_with_skill = await user_model.find_all_users({ skills: { $elemMatch: { _id: new ObjectId(id) } } });
    for (const user of users_with_skill) {
      user.skills = user.skills.filter((s) => s._id.toString() !== id);
      await user_model.update_user(user._id, { skills: user.skills });
    }

    const result = await skill_model.delete_skill({ _id: new ObjectId(id) });
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
  get_skill,
  update_skill,
  delete_skill,
};
