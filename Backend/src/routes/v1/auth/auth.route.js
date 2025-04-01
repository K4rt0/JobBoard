import express from "express";
import { auth_controller } from "~/controllers/auth/auth.controller";
import { auth_validation } from "~/validations/auth/auth.validation";
import { auth_middleware } from "~/middlewares/auth/auth.middleware";

const auth_route = express.Router();

auth_route
  .post("/login", [auth_validation.login_user], auth_controller.login_user)
  .post("/google-login", [auth_validation.google_login_user], auth_controller.google_login_user)
  .post("/refresh-token", [auth_validation.refresh_token], auth_controller.refresh_token)
  .post("/logout", [auth_middleware.jwt_auth()], auth_controller.logout_user);

export default auth_route;
