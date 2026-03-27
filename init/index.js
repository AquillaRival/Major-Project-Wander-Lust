const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(mongoUrl);
}

const initDB = async () => {
  await Listing.insertMany(initData.data);
  console.log("Data was initialised");
};

initDB();
