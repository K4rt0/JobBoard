import express from "express";
import { user_controller } from "~/controllers/account/user.controller";
import { user_validation } from "~/validations/account/user.validation";
import { refresh_token_controller } from "~/controllers/auth/refesh_token.controller";
import { auth_middleware } from "~/middlewares/account/auth.middleware";

const router = express.Router();

router.post("/register", user_validation.create_user, user_controller.create_user).post("/login", user_validation.login_user, user_controller.login_user).post("/refresh-token", refresh_token_controller.refresh_token).get("/profile", auth_middleware.jwt_auth, user_controller.get_profile);

export const user_route = router;
