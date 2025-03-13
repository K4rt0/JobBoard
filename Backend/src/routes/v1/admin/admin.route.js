import express from "express";
import admin_login_controller from "~/controllers/admin/admin_login.controller";
import admin_login_validation from "~/validations/admin/admin.validation";
import { admin_user_route } from "~/routes/v1/admin/admin_user.route";

const router = express.Router();
router.post("/login", admin_login_validation, admin_login_controller);

router.use("/users", admin_user_route);

export const admin_route = router;
