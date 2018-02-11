//---------------------------------------------------
// Dependencies
//---------------------------------------------------
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var bodyParser = require("body-parser");
var path = require("path");
var PORT = process.env.PORT || 3000;


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

// mongoose dependency used for accessing mongodb collection
var mongoose = require("mongoose");


// Requiring the `Article` model for accessing the collection
var Articles = require("./models/articles.js");

//-----------------------------
// mongoose connection
//-----------------------------
mongoose.Promise = Promise;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost/tedtalks", {});
}

//------------------------------------------
// connect to the controller for app routes
//------------------------------------------
var routes = require("./controller/controller.js");
app.use("/", routes);


// Listen on port 3000
app.listen(PORT, function () {
  console.log(`App running on port ${PORT}!`);
});