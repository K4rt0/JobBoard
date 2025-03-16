import express from "express";
import { user_controller } from "~/controllers/user/user.controller";
import { user_validation } from "~/validations/user/user.validation";
import { auth_middleware } from "~/middlewares/auth/auth.middleware";

const user_route = express.Router();

user_route
  // Admin
  .get("/get-all", [auth_middleware.jwt_auth(true), user_validation.get_all_users], user_controller.get_user)
  .get("/profile", [auth_middleware.jwt_auth(), auth_middleware.is_inactive], user_controller.get_user)
  .get("/:id", [auth_middleware.jwt_auth(true)], user_controller.get_user)
  .patch("/:id/status", [auth_middleware.jwt_auth(true), user_validation.update_user_status], user_controller.update_user_status)
  // User
  .post("/register", user_validation.create_user, user_controller.create_user)

export default user_route;
