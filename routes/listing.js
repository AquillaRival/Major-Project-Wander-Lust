const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }),
);

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

// Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new listing created!!!");
    res.redirect("/listings");
  }),
);

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exists.");
      return res.redirect("/listings");
    }
    console.log(listing.owner.username);
    res.render("./listings/show.ejs", { listing });
  }),
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exists.");
      return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
  }),
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = { ...req.body.listing };
    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  }),
);

// Destroy Routes
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleated");
    res.redirect("/listings");
  }),
);

module.exports = router;
