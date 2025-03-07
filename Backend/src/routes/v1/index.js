import express from "express";

import { exampleRoutes } from "./exampleRoute";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

router.use("/example", exampleRoutes);

export const APIs_V1 = router;
