import express from "express";
import admin_jwt_middleware from "~/middlewares/admin/admin_jwt.middleware";
import { admin_skill_validation } from "~/validations/admin/admin_skill.validation";

const admin_skill_route = express.Router();

admin_skill_route.get("/get-all", [admin_jwt_middleware, admin_skill_validation.get_all_skills]);

export default admin_skill_route;
