import express from "express";
import { user_controller } from "~/controllers/user/user.controller";
import { user_validation } from "~/validations/user/user.validation";
import { auth_middleware } from "~/middlewares/auth/auth.middleware";

const user_route = express.Router();

user_route
  // User
  .get("/profile", [auth_middleware.jwt_auth()], user_controller.get_user)
  .post("/register", user_validation.create_user, user_controller.create_user)
  .patch("/change-password", [auth_middleware.jwt_auth(), user_validation.change_user_password], user_controller.change_user_password)
  .patch("/change-info", [auth_middleware.jwt_auth(), user_validation.update_user], user_controller.update_user)
  .patch("/update-skills", [auth_middleware.jwt_auth(), user_validation.update_skills], user_controller.update_skills)
  .patch("/update-socials", [auth_middleware.jwt_auth(), user_validation.update_socials], user_controller.update_socials)
  .get("/get-all-project", auth_middleware.jwt_auth(), user_controller.get_all_projects)
  .get("/get-all-project-pagination", [auth_middleware.jwt_auth(), user_validation.get_all_projects_pagination], user_controller.get_all_projects_pagination)

  // Admin
  .get("/get-all", auth_middleware.jwt_auth(true), user_controller.get_all_users)
  .get("/get-all-pagination", [auth_middleware.jwt_auth(true), user_validation.get_all_users_pagination], user_controller.get_all_users_pagination)

  .get("/:id", [auth_middleware.jwt_auth(true)], user_controller.get_user)
  .patch("/:id/status", [auth_middleware.jwt_auth(true), user_validation.update_user_status], user_controller.update_user_status);

export default user_route;
