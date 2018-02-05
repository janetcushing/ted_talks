

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");

//
var bodyParser = require("body-parser");
// var methodOverride = require("method-override");
var path = require("path");
var PORT = process.env.PORT || 3000;
//

// Initialize Express
var app = express();
app.use(logger("dev"));
// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(express.static("./public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts")
}));
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, "views"));

// Our newest addition to the dependency family
var mongoose = require("mongoose");


// Requiring the `Example` model for accessing the `examples` collection
// var db = require("./models");
var Articles = require("./models/articles.js");
// var SavedArticles = require("./models/savedArticles.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
  // mongoose connection
  mongoose.Promise = Promise;
  mongoose.connect("mongodb://localhost/tedtalks", {
    // useMongoClient: true
  });


// Database configuration
// var databaseUrl = "ted_talks";
// var collections = ["articles", "savedArticles"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//   console.log("Database Error:", error);
// });

// Save a new Example using the data object
// Example.create(data)
//   .then(function(dbExample) {
//     // If saved successfully, print the new Example document to the console
//     console.log(dbExample);
//   })
//   .catch(function(err) {
//     // If an error occurs, log the error message
//     console.log(err.message);
//   });

var routes = require("./controller/controller.js");
app.use("/", routes);


// Listen on port 3000
app.listen(PORT, function () {
  console.log("App running on port 3000!");
});