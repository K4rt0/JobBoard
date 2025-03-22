import express from "express";
import { project_controller } from "~/controllers/project/project.controller";
import { auth_middleware } from "~/middlewares/auth/auth.middleware";
import project_middleware from "~/middlewares/project/project.middleware";
import { project_validation } from "~/validations/project/project.validation";

const project_route = express.Router();

project_route
  .post("/create", [auth_middleware.jwt_auth(), project_validation.create_project, project_middleware], project_controller.create_project)
  .get("/get-all", project_controller.get_all_projects)
  .get("/get-all-pagination", project_validation.get_all_projects_pagination, project_controller.get_all_projects_pagination)
  .get("/get-all-applicants-pagination", [auth_middleware.jwt_auth(), project_validation.get_all_applicants_pagination, project_middleware], project_controller.get_all_applicants_pagination)
  .patch("/update/:project_id", [auth_middleware.jwt_auth(), project_validation.update_project, project_middleware], project_controller.update_project)
  .patch("/update-status/:project_id", [auth_middleware.jwt_auth(), project_validation.update_project_status], project_controller.update_project_status)
  .get("/:project_id", project_validation.get_project, project_controller.get_project)
  .post("/apply/:project_id", [auth_middleware.jwt_auth(), project_validation.apply_project], project_controller.apply_project)

  .get("/get-all-applicants/:project_id", [auth_middleware.jwt_auth(), project_validation.get_all_applicants, project_middleware], project_controller.get_all_applicants);
// .patch("/update-applicant-status/:project_id/:applicant_id", project_controller.update_applicant_status);
// .delete("/delete/:project_id", [auth_middleware.jwt_auth()], project_controller.delete_project);

export default project_route;
