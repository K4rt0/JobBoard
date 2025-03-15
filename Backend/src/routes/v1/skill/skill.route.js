import express from "express";
import { skill_controller } from "~/controllers/skill/skill.controller";
import { auth_middleware } from "~/middlewares/auth/auth.middleware";
import { skill_validation } from "~/validations/skill/skill.validation";

const skill_route = express.Router();

skill_route
  .post("/create", [auth_middleware.jwt_auth(true), skill_validation.create_skill], skill_controller.create_skill)
  .patch("/update/:id", [auth_middleware.jwt_auth(true), skill_validation.update_skill], skill_controller.update_skill)
  .delete("/delete/:id", [auth_middleware.jwt_auth(true), skill_validation.delete_skill], skill_controller.delete_skill)
  .get("/get-all-pagination", skill_validation.get_all_skills_pagination, skill_controller.get_all_skills_pagination)
  .get("/get-all", skill_controller.get_all_skills)
  .get("/:id", skill_controller.get_skill_by_id);

export default skill_route;
