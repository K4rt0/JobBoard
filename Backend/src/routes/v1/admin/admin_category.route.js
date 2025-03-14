import express from "express";
import { category_controller } from "~/controllers/admin/admin_category.controller";
import { category_validation } from "~/validations/admin/admin_category.validation";
import admin_jwt_middleware from "~/middlewares/admin/admin_jwt.middleware";

const admin_category_route = express.Router();

admin_category_route
  .post("/create", [admin_jwt_middleware, category_validation.create_category], category_controller.create_category)
  .get("/get-all", [admin_jwt_middleware, category_validation.get_all_categories], category_controller.get_all_categories)
  .get("/:id", admin_jwt_middleware, category_controller.get_category_by_id)
  .patch("/update/:id", [admin_jwt_middleware, category_validation.update_category], category_controller.update_category)
  .delete("/delete/:id", admin_jwt_middleware, category_controller.delete_category);

export default admin_category_route;
