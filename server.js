const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Our scraping tools
// It works on the client and on the server
const cheerio = require("cheerio");

// Require all models
// var db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//  Set up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scrappy");

// Import routes
require("./routes/html-routes.js")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});