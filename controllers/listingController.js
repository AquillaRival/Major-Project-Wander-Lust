const Listing = require("../models/listingsModel");

// Helper function in listingController.js
async function geocodeAddress(city, country) {
  try {
    let query = `${city}, ${country || "India"}`;
    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "User-Agent": "WanderlustApp/1.0" } },
    );
    let data = await response.json();

    if (data && data.length > 0) {
      return {
        type: "Point",
        coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
      };
    }
  } catch (err) {
    console.error("Geocoding error:", err);
  }

  // Fallback if all attempts fail
  return {
    type: "Point",
    coordinates: [77.209, 28.6139],
  };
}
async function getGeometry(listingData) {
  if (
    listingData.geometry &&
    listingData.geometry.coordinates &&
    listingData.geometry.coordinates[0] !== "" &&
    listingData.geometry.coordinates[1] !== ""
  ) {
    return {
      type: "Point",
      coordinates: [
        parseFloat(listingData.geometry.coordinates[0]),
        parseFloat(listingData.geometry.coordinates[1]),
      ],
    };
  }
  return await geocodeAddress(listingData.city, listingData.country);
}

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist.");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file ? req.file.path : "";
  let filename = req.file ? req.file.filename : "";

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = await getGeometry(req.body.listing);

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist.");
    return res.redirect("/listings");
  }
  let original_img = listing.image.url;
  original_img = original_img.replace("/upload", "/upload/h_200,w_300");
  res.render("./listings/edit.ejs", { listing, original_img });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  listing.geometry = await getGeometry(req.body.listing);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
