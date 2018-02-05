var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
// var db = require("../models");
var mongojs = require("mongojs");
var router = express.Router();
// 
// var db = require("../models");
var Articles = require("../models/articles.js");
// var SavedArticles = require("../models/savedArticles.js");

// // Database configuration
// var databaseUrl = "ted_talks";
// var collections = ["articles", "savedArticles"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//   console.log("Database Error:", error);
// });

// module.exports = db;
const previousTitles = [];

//=================================================
// Functions
//=================================================

function initializePreviousTitlesArray() {
  previousTitles.length = 0;
  Articles.find({})
    .then(function (data) {
      data.forEach(function (element) {
        previousTitles.push(element.title);
      });
      console.log(`PreviousTitles ${previousTitles.toString()}`);
    }).catch(function (error) {
      // Throw any errors to the console
      console.log("DB Error from getPreviouslyScrapedArticles")
      console.log(error);
    });
}

function checkForPreviousInserts(title) {
  console.log(title);
  console.log(previousTitles.toString());
  console.log("prevTitles includes title" + previousTitles.includes(title));
  return previousTitles.includes(title);
}
// console.log("im in checkForPreviousInserts");
// // console.log("article details");
// // console.log(articleDetails);
// console.log("im about to search the Articles databsase for " + title);
// console.log("article details.title " + title);
// Articles.find({
//     title: title
//   })
//   .then(function (data) {
//     console.log("im consoling the data now");
//     console.log("it shouldnt find the row");
//     console.log(data);
//     console.log("im still in checkForPreviousInserts");
//     // if (!data.title) {
//       // insertNewArticle(articleDetails);
//     // }
//   }).catch(function (error) {
//     console.log("error returned in checkForPreviousInserts");
//     console.log(error);
// });
// }

function insertNewArticles(currentArticles, res) {
  console.log("im in insertNewArticles");
  console.log("dumping currentArticles and there should be multiple");
  console.log(currentArticles);
  // Articles.create(articleDetails).then(function (data) {
  // Articles.collection.insert(currentArticles, function (err, data) {
  Articles.insertMany(currentArticles, function (err, data) {
    if (err) {
      console.log("There was a DB error");
      console.log(err);
      res.status(500).end();
    } else {
      console.log("inserted");
      // console.log("inserted this many: " + data.insertedCount);
      console.log(data);
      let result = data.length.toString();
      console.log("RESULT" + result);
      res.send(result);
      // res.status(200).end();
    }
  });
}

// function onInsert(err, data) {
//   if (err) {
//     console.log("There was a DB error");
//     console.log(err);
//     res.status(500).end();
//   } else {
//     console.log("inserted");
//     console.log("inserted this many: " + data.insertedCount);
//     console.log(data);
//     // res.status(200).send(data.insertedCount);
//   }
// }

function updateSavedArticle(req, res) {
  console.log("im in updateSavedArticle");
  console.log(`req.body and req.params:`);
  console.log(req.body);
  console.log(req.params);
  // Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);
  Articles.findByIdAndUpdate(req.params.id, {
    $set: {
      saved: true
    }
  }).then(function (data) {
    console.log(data);
    res.send("success");
  }).catch(function (err) {
    console.log("There was a DB error - updateSavedArticle");
    console.log(err);
    res.status(500).send("A Server Error Occurred");
  });
}

// function createNewSavedArticle(req, res) {
//   console.log("im in createNewSavedArticle");
//   SavedArticles.$push({
//     articleId: req.body.id,
//     title: req.body.title,
//     link: req.body.link,
//     speaker: req.body.speaker,
//     date_posted: req.body.date_posted,
//     classification: req.body.classification
//   }), (function (error, data) {
//     if (data) {
//       console.log(data);
//       res.status(200).end();
//     } else if (err) {
//       // If an error occurred, send a generic server failure
//       console.log("There was a DB error");
//       console.log(err);
//       res.status(500).send("A Server Error Occurred");
//     }
//   });
// }

function getPreviouslyScrapedArticles(req, res) {
  Articles.find().where('saved').equals(false)
    .then(function (data) {
      const scrapedArticles = [];
      data.forEach(function (element) {
        // previousTitles.push(element.title);
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
      res.render("home", {
        scrapedArticles
      });
    }).catch(function (error) {
      // Throw any errors to the console
      console.log("DB Error from getPreviouslyScrapedArticles")
      console.log(error);
    });
}

function getSavedArticles(req, res) {
  console.log("IM IN getSavedArticles");
  Articles.find().where('saved').equals(true)
    .then(function (savedArticles) {
      console.log("DATA GOT RETURNED FROM GETSAVEDArTICLES");
      console.log(savedArticles);
      res.render("saved", {
        "savedArticles": savedArticles
      })
    }).catch(function (err) {
      console.log("DB Error from getSavedArticles")
      console.log(err);
    });
}


//==============
// ROUTES
//==============

// Main route (simple Hello World Message)
router.get("/", function (req, res) {
  initializePreviousTitlesArray();
  getPreviouslyScrapedArticles(req, res);
  // res.render("home");
  // res.send("Hello world");
});

router.get("/home", function (req, res) {
  getPreviouslyScrapedArticles();
  // res.render("home");
  // res.send("Hello world");
});

router.get("/saved", function (req, res) {
  console.log("IM ON DTHE SERVER SIDE FOR SAVED");
  getSavedArticles(req, res);
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
    console.log("counter1 " + counter);
    // For each element with a "media__message" class
    $(".media__message").each(function (i, element) {
      console.log("Im in media message");
      console.log("counter2 " + counter);
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
      let isRepeatTitle = checkForPreviousInserts(articleDetails.title);
      console.log(`isRepeatTitle ${isRepeatTitle}`);
      if (isRepeatTitle) {
        console.log(`this is a repeat title ${articleDetails.title}`);
      } else {
        currentArticles.push(articleDetails);
        previousTitles.push(articleDetails.title);
        console.log("counter3 " + counter);
        counter++;
        console.log("counter4 " + counter);
      }
      //limits the Ted Talks returned to 20
      if (counter == 5) {
        console.log("counter5 " + counter);
        console.log("counter6 " + counter);
        insertNewArticles(currentArticles, res);
        return false;
      }
    });

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





//--------------------------------------
// Export routes for server.js to use.
//--------------------------------------
module.exports = router;