import express from "express";
import { exampleController } from "~/controllers/exampleController";
import { exampleValidation } from "~/validations/exampleValidation";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json({ message: "Get Method" });
  })
  .post(exampleValidation.createExample, exampleController.createExample);

export const exampleRoutes = router;
