const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

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

app.get("/listing", (req, res) => {
  Listing.find({}).then((res) => {
    console.log(res);
  });
});

app.get("/", (req, res) => {
  res.send("Working...");
});

app.listen(8080, () => {
  console.log("Server is Listening to port 8080");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("Successful!!!");
// });
