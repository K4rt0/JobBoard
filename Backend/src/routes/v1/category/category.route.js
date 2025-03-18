import express from "express";
import { category_controller } from "~/controllers/category/category.controller";
import { auth_middleware } from "~/middlewares/auth/auth.middleware";
import { category_validation } from "~/validations/category/category.validation";

const category_route = express.Router();

category_route
  .post("/create", [auth_middleware.jwt_auth(true), category_validation.create_category], category_controller.create_category)
  .patch("/update/:id", [auth_middleware.jwt_auth(true), category_validation.update_category], category_controller.update_category)
  .delete("/delete/:id", [auth_middleware.jwt_auth(true), category_validation.delete_category], category_controller.delete_category)
  .get("/get-all-pagination", category_validation.get_all_categories_pagination, category_controller.get_all_categories_pagination)
  .get("/get-all", category_controller.get_all_categories)
  .get("/:id", category_controller.get_category);

export default category_route;
