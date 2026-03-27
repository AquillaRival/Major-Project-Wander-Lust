# First Step

first step is to create app.js file with basic routing and connection with mongodb database by rewuiring mongoose.

# Second Step

In this what we did is we created our Listing schema and exported our model.
created out sample listing in testListing routing and saved it to mongodb.

# Third Step

- Created data.js file in which data is stored in array of objects format.
- Created index.js file in which we initialised our data to the mongodb.

# Step 4

- Created routings
- GET - /listings - Show route for all listings - index.ejs.
- GET - /listings/new - New Route - new.ejs.
- POST - /listings - Create Route - redirection to /listings.
- GET - /listings/:id - Show Route - show.ejs.
- GET - /listings/:id/edit - Edit Route - edit.ejs.
- PUT - /listings/:id - Update Route - redirection to /listings/id.
- DELETE - /listings/:id - Delete Route - redirection to /listings.
