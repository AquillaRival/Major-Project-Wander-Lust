const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://unsplash.com/illustrations/a-drawing-of-a-bear-with-a-thought-bubble-above-his-head-phJ3PYitwjA",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/illustrations/a-drawing-of-a-bear-with-a-thought-bubble-above-his-head-phJ3PYitwjA"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
