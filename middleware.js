const Listing = require("./models/listingsModel.js");
const Review = require("./models/reviewsModel.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You are not logged in.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const wrapAsync = require("./utils/wrapAsync.js");

module.exports.isOwner = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let listings = await Listing.findById(id);
  if (!listings) {
    req.flash("error", "Listing does not exist.");
    return res.redirect("/listings");
  }
  if (!listings.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit.");
    return res.redirect(`/listings/${id}`);
  }
  next();
});

module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
  let { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review does not exist.");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
});
