import express from "express";
import admin_login_controller from "~/controllers/admin/admin_login.controller";
import admin_login_validation from "~/validations/admin/admin.validation";

const router = express.Router();

router.post("/login", admin_login_validation, admin_login_controller);

export const admin_route = router;
