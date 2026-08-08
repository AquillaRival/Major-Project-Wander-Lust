const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");
const Review = require("./models/reviews.js");
const reviewSchema = require("./schema.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  mongoose.connect(mongoUrl);
}

main()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// listing route
app.use("/listings", listings);

// Reviews
app.use("listings/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("./listings/hero.ejs");
});

app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Internal Error" } = err;
  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is Listening to port 8080");
});
