const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.get("/", (req, res) => {
  res.send("Working...");
});

app.listen(8080, () => {
  console.log("Server is Listening to port 8080");
});
