const express = require("express");
const router = express.Router();
const reviews = require("../controllers/reviewController");

router.get("/", reviews.getAllReviews);
router.get("/:id", reviews.getReviewById);
router.post("/", reviews.createReview);
router.put("/:id", reviews.updateReview);
router.delete("/:id", reviews.deleteReview);

module.exports = router;
