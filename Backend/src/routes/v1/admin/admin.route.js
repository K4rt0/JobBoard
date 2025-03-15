import express from "express";
import { auth_controller } from "~/controllers/auth/auth.controller";
import { auth_validation } from "~/validations/auth/auth.validation";

const admin_route = express.Router();

admin_route.post("/login", auth_validation.admin_login, auth_controller.admin_login);

export default admin_route;
