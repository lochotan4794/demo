const express = require("express");
const router = express.Router();

const {
  getAllReviews,
  getReviewDetail,
  createReview,
  editReview,
  deleteReview,
  searchReview,
} = require("../controllers/review");
const auth = require("../middlewares/auth");

router.get("/", getAllReviews);

router.get("/search", searchReview);
router.get("/:id", getReviewDetail);
router.post("/", auth, createReview);
router.put("/:id", auth, editReview);
router.delete("/:id", deleteReview);

module.exports = router;
