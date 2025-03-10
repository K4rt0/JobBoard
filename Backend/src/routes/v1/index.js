import express from "express";

import { user_route } from "~/routes/v1/account/user.route";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

router.use("/users", user_route);

export const APIs_V1 = router;
