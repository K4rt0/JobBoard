import express from "express";

import { user_route } from "~/routes/v1/account/user.route";
import { admin_route } from "~/routes/v1/admin/admin.route";

const router = express.Router();

router.use("/users", user_route);
router.use("/admin", admin_route);

export const APIs_V1 = router;
