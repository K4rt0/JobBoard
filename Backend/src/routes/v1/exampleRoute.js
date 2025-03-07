import express from "express";

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json({
      message: "Get Method",
    });
  })
  .post((req, res) => {
    res.json({
      message: "Post Method",
    });
  })
  .put((req, res) => {
    res.json({
      message: "Put Method",
    });
  })
  .delete((req, res) => {
    res.json({
      message: "Delete Method",
    });
  });

export const exampleRoutes = router;
