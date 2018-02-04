var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
// var db = require("../models");
var mongojs = require("mongojs");
var router = express.Router();
// 
// var db = require("../models");
var Articles = require("../models/articles.js");
var SavedArticles = require("../models/savedArticles.js");

// // Database configuration
// var databaseUrl = "ted_talks";
// var collections = ["articles", "savedArticles"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//   console.log("Database Error:", error);
// });

// module.exports = db;

//=================================================
// Functions
//=================================================
function checkForPreviousInserts(articleDetails) {
  console.log("im in checkForPreviousInserts");
  console.log("article details");
  console.log(articleDetails);
  Articles.find({ title: articleDetails.title}), (function (error, data) {
    if (error) {
      console.log("error returned in avoidDoubleInserts");
      console.log(error);
    } else if (data) {
      console.log(data);
      if (found) {}
      return true
    } else {
      return false
    }
  });
}

function insertNewArticle(currentArticles) {
  console.log("im in insertNewArticle");
  Articles.create(currentArticles), (function (error, data) {
    if (data) {
      console.log(inserted);
      console.log(data);
      console.log("count" + currentArticles.length);
      getPreviouslyScrapedArticles();
    } else if (err) {
      // If an error occurred, send a generic server failure
      console.log("There was a DB error");
      console.log(err);
      res.status(500).end();
    }
  });
}


function createNewSavedArticle(req, res) {
  console.log("im in createNewSavedArticle");
  SavedArticles.$push({
    articleId: req.body.id,
    title: req.body.title,
    link: req.body.link,
    speaker: req.body.speaker,
    date_posted: req.body.date_posted,
    classification: req.body.classification
  }), (function (error, data) {
    if (data) {
      console.log(data);
      res.status(200).end();
    } else if (err) {
      // If an error occurred, send a generic server failure
      console.log("There was a DB error");
      console.log(err);
      res.status(500).send("A Server Error Occurred");
    }
  });
}

function getPreviouslyScrapedArticles(req, res) {
  Articles.find({}, function (error, data) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, return the data to the home page
    else {
      console.log(data);
      const scrapedArticles = [];
      data.forEach(function (element) {
        scrapedArticles.push({
          id: element._id,
          title: element.title,
          link: element.link,
          speaker: element.speaker,
          date_posted: element.date_posted,
          classification: element.classification,
          saved: false
        });
      });
      console.log(scrapedArticles);
      res.render("home", {
        scrapedArticles
      });
    }
  });
}

//==============
// ROUTES
//==============

// Main route (simple Hello World Message)
router.get("/", function (req, res) {
  getPreviouslyScrapedArticles(req, res);
  // res.render("home");
  // res.send("Hello world");
});

router.get("/home", function (req, res) {
  getPreviouslyScrapedArticles();
  // res.render("home");
  // res.send("Hello world");
});

// router.get("/scrape", function (req, res) {
//   getScrapedArticles();
// });

// Retrieve data from the db
/*
router.get("/all", function (req, res) {
  // Find all results from the scrapedData collection in the db
  db.articles.find({}, function (error, found) {
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
*/

// Scrape data from one site and place it into the mongodb db
router.get("/scrape", function (req, res) {
      request("https://www.ted.com/talks", function (error, response, html) {
        // Load the html body from request into cheerio
        const $ = cheerio.load(html);
        const currentArticles = [];
        let counter = 0;
        // For each element with a "media__message" class
        $(".media__message").each(function (i, element) {
          console.log("Im in media message");
          // Save the text and href of each link enclosed in the current element
          let articleDetails = {
            title: $(element).children().children("a").text(),
            // var link = "https://www.ted.com" + $(element).children().children("a").attr("href");
            link: $(element).children().children("a").attr("href"),
            speaker: $(element).children(".talk-link__speaker").text(),
            date_posted: $(element).children().children(".meta__item").children(".meta__val").text(),
            classification: $(element).children().children(".meta__row").children(".meta__val").text(),
            saved: false
          }
          let found = checkForPreviousInserts(articleDetails);
          console.log(found);
          if ((!found) && (articleDetails.title && articleDetails.link)) {
            currentArticles.push(articleDetails);
          }
          counter++;
          //limits the Ted Talks returned to 20
          return counter < 1;
        });
        console.log(currentArticles);
        console.log("count" + currentArticles.length);
        insertNewArticle(currentArticles);
      });
    });


    // Make a request for the news section of ycombinator

    // request("https://www.ted.com/talks", function (error, response, html) {
    //   // Load the html body from request into cheerio
    //   var $ = cheerio.load(html);
    //   // For each element with a "title" class
    //   $(".media__message").each(function (i, element) {
    //     console.log("Im in media message");
    //     // Save the text and href of each link enclosed in the current element
    //     var title = $(element).children().children("a").text();
    //     // var link = "https://www.ted.com" + $(element).children().children("a").attr("href");
    //     var link = $(element).children().children("a").attr("href");
    //     var speaker = $(element).children(".talk-link__speaker").text();
    //     var date_posted = $(element).children().children(".meta__item").children(".meta__val").text();
    //     var classification = $(element).children().children(".meta__row").children(".meta__val").text();

    // If this found element had both a title and a link
    // if (title && link) {
    //   // Insert the data in the scrapedData db
    //   db.articles.insert({
    //       title: title,
    //       link: link,
    //       speaker: speaker,
    //       date_posted: date_posted,
    //       classification: classification
    //     },
    //     function (err, inserted) {
    //       if (err) {
    //         // Log the error if one is encountered during the query
    //         console.log(err);
    //       } else {
    //         // Otherwise, log the inserted data
    //         console.log(inserted);
    //       }
    //     });
    // }
    // //returns 20 Ted Talks
    // return i < 19;
    // });
    // });

    // Send a "Scrape Complete" message to the browser
    // res.send("Ted Scrape Complete");
    // });


    //----------------------------------------------
    // Route to add a new saved article from the
    // home page
    //----------------------------------------------
    router.post("/api/saved/new", function (req, res) {
      createNewSavedArticle(req, res);
    });


    //--------------------------------------
    // Export routes for server.js to use.
    //--------------------------------------
    module.exports = router;