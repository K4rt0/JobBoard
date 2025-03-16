import express from "express";

import user_route from "~/routes/v1/user/user.route";
import category_route from "~/routes/v1/category/category.route";
import admin_route from "~/routes/v1/admin/admin.route";
import auth_route from "~/routes/v1/auth/auth.route";
import skill_route from "~/routes/v1/skill/skill.route";

const router = express.Router();

router.use("/admin", admin_route);

router.use("/user", user_route);
router.use("/auth", auth_route);
router.use("/category", category_route);
router.use("/skill", skill_route);

export const APIs_V1 = router;
