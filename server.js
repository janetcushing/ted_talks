// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "ted_talks";
var collections = ["articles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

//==============
// ROUTES
//==============
// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.articles.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("https://www.ted.com/talks", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".media__message").each(function(i, element) {
      console.log("Im in media message");
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children().children("a").text();
      // var link = "https://www.ted.com" + $(element).children().children("a").attr("href");
      var link = $(element).children().children("a").attr("href");
      var speaker = $(element).children(".talk-link__speaker").text();
      var date_posted = $(element).children().children(".meta__item").children(".meta__val").text();
      var classification = $(element).children().children(".meta__row").children(".meta__val").text();

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.articles.insert({
          title: title,
          link: link,
          speaker: speaker,
          date_posted: date_posted,
          classification: classification
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
      //returns 20 Ted Talks
      return i<19;
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Ted Scrape Complete");
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
