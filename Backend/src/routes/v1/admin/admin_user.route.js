import express from "express";
import { admin_user_controller } from "~/controllers/admin/admin_user.controller";
import admin_jwt_middleware from "~/middlewares/admin/admin_jwt.middleware";
import { admin_user_validation } from "~/validations/admin/admin_user.validation";

const admin_user_route = express.Router();

admin_user_route
  .get("/get-all", [admin_jwt_middleware, admin_user_validation.get_all_users], admin_user_controller.get_all_users)
  .get("/:id", [admin_jwt_middleware], admin_user_controller.get_user)
  .patch("/:id/status", [admin_jwt_middleware, admin_user_validation.update_user_status], admin_user_controller.update_user_status);

export default admin_user_route;
