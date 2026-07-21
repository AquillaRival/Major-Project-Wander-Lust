const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;
const review = require("./reviews.js");

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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
