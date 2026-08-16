const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

// Models
const Listing = require("../models/listingsModel.js");
const Review = require("../models/reviewsModel.js");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const {
  createReview,
  deleteReview,
} = require("../controllers/reviewController.js");

// Reviews
// Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview),
);

module.exports = router;
