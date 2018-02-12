
//=================================================
// dependencies
//=================================================
const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const mongojs = require("mongojs");
const router = express.Router();
const Articles = require("../models/articles.js");

//=================================================
// global variables
//=================================================
const prevlinks = [];

//=================================================
// Functions
//=================================================

//-----------------------------------------------------
// load the collection into an array, so that when new
// articles are scraped can check the array and make sure
// we dont duplicate an article in the collection
//-----------------------------------------------------
function initializePreviouslinksArray() {
  prevlinks.length = 0;
  Articles.find({})
    .then(function (data) {
      data.forEach(function (element) {
        prevlinks.push(element.link);
      });
    }).catch(function (error) {
      // Throw any errors to the console
      console.log("DB Error from initializePreviouslinksArray")
      console.log(error);
    });
}

//-----------------------------------------------------
// check to see if an article already exists in the
// collection so that we dont insert it into the 
// collection more than one time 
//-----------------------------------------------------
function searchForPreviousInserts(link) {
  Articles.find().where('link').equals(link)
    .then(function (data) {
      return true;
    }).catch(function (error) {
      // Throw any errors to the console
      console.log(`DB Error from searchForPreviousInserts`)
      console.log(error);
    });
}


//-----------------------------------------------------
// bulk insert the newly scraped articles into the
// collection
//-----------------------------------------------------
function insertNewArticles(currentArticles, res) {
  Articles.insertMany(currentArticles, function (err, data) {
    if (err) {
      console.log(`There was a DB error from insertNewArticles: ${err} `);
      res.status(500).end();
    } else {
      let result = data.length.toString();
      res.send(result);
    }
  });
}


//-----------------------------------------------------
// update the saved field on the document
//-----------------------------------------------------
function updateSavedArticle(req, res) {
  console.log("im in updateSavedArticle");
  Articles.findByIdAndUpdate(req.params.id, {
    $set: {
      saved: req.body.saved
    }
  }).then(function (data) {
    console.log(data);
    res.send("success");
  }).catch(function (err) {
    console.log(`There was a DB error - updateSavedArticle: ${err}`);
    res.status(500).send("A Server Error Occurred");
  });
}


//-----------------------------------------------------
// redisplay the notes in the modal after a note has
// been added or deleted
//-----------------------------------------------------
function displayNotesInModal(req, res) {
  console.log("im in displayNotesInModal on the server side");
  console.log(req.params.id);
  Articles.findById(req.params.id)
    .then(function (data) {
      console.log(data);
      const notes = [];
      for (let i = 0; i < data.notes.length; i++) {
        console.log(data.notes[i]);
        notes.push({
          "note": data.notes[i]
        });
      }
      res.render("saved", {
        "notes": notes
      });
    }).catch(function (err) {
      console.log(`There was a DB error - displayNotesInModal ${err}`);
      res.status(500).send("A Server Error Occurred");
    });
}

//-----------------------------------------------------------
// add a note to an article in the database, from the 
// notes modal
//-----------------------------------------------------------
function addANote(req, res) {
  console.log("im in addANote");
  Articles.findByIdAndUpdate(req.params.id, {
    $addToSet: {
      notes: req.body.note
    }
  }, {
    new: true
  }).then(function (data) {
    console.log(data);
    const notes = [];
    for (let i = 0; i < data.notes.length; i++) {
      console.log(data.notes[i]);
      notes.push({
        "note": data.notes[i]
      });
    }
    res.render("saved", {
      notes: notes
    });
  }).catch(function (err) {
    console.log(`There was a DB error - addANote: ${err}`);
    res.status(500).send("A Server Error Occurred");
  });
}

//-----------------------------------------------------------
// delete a note from an article in the database, from the 
// notes modal
//-----------------------------------------------------------
function deleteANote(req, res) {
  console.log("im in deleteANote");
  Articles.findByIdAndUpdate(req.params.id, {
    $pull: {"notes": req.body.note},
    new: true,
    multi: false
  }).then(function (data) {
    res.render("saved", {
      notes: data.notes
    });
  }).catch(function (err) {
    console.log(`There was a DB error - deleteANote: ${err}`);
    res.status(500).send("A Server Error Occurred");
  });
}


//-----------------------------------------------------
// retrieve the previously scraped articles from the
// Article collection to populate the home page
//-----------------------------------------------------
function getPreviouslyScrapedArticles(req, res) {
  Articles.find().where('saved').equals(false)
    .then(function (data) {
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
      res.render("home", {
        scrapedArticles
      });
    }).catch(function (err) {
      // Throw any errors to the console
      console.log(`DB Error from getPreviouslyScrapedArticlesc; ${err}`);
    });
}

//-----------------------------------------------------
// retrieve the previously scraped articles from the
// Article collection to populate the saved article page
//-----------------------------------------------------
function getSavedArticles(req, res) {
  console.log("IM IN getSavedArticles");
  Articles.find().where('saved').equals(true)
    .then(function (savedArticles) {
      console.log(savedArticles);
      res.render("saved", {
        "savedArticles": savedArticles
      })
    }).catch(function (err) {
      console.log(`DB Error from getSavedArticles: ${err}`);
    });
}



//==============
// ROUTES
//==============

//----------------------------------------------
// Main route brings up the home page
//----------------------------------------------
router.get("/", function (req, res) {
  initializePreviouslinksArray();
  getPreviouslyScrapedArticles(req, res);
});

//----------------------------------------------
// saved route brings up the saved articles page
//----------------------------------------------
router.get("/saved", function (req, res) {
  getSavedArticles(req, res);
});

//----------------------------------------------
// Route to update the  saved boolean from the
// home page or saved page.  Saved is set to true
// from the home page when the article is saved
// and set to false from the saved page when the
// "delete from saved" button is clicked
//----------------------------------------------
router.put("/api/saved/:id", function (req, res) {
  updateSavedArticle(req, res);
});


//----------------------------------------------
// get the previously saved notes to display in 
// the modal.handlebars
//----------------------------------------------
router.get("/api/prevnotes/:id", function (req, res) {
  console.log("in on hte server side /api/prevnotes/:id");
  console.log(req.params);
  console.log(req.body);
  displayNotesInModal(req, res);
});


//----------------------------------------------
// Route to update the  saved article with a new  
// note, from the saved page
//----------------------------------------------
router.put("/api/note/:id", function (req, res) {
  addANote(req, res);
});

//----------------------------------------------
// Route to delete a previously saved note 
//----------------------------------------------
router.put("/api/deletenote/:id", function (req, res) {
  deleteANote(req, res);
});


//----------------------------------------------
// Route to scrape new articles 
//----------------------------------------------
router.get("/scrape", function (req, res) {
  request("https://www.ted.com/talks", function (error, response, html) {
    // Load the html body from request into cheerio
    const $ = cheerio.load(html);
    const currentArticles = [];
    let counter = 0;
    console.log("counter1 " + counter);
    // For each element with a "media__message" class
    $(".media__message").each((i, element) => {
      let articleDetails = {
        title: $(element).children().children("a").text(),
        link: $(element).children().children("a").attr("href"),
        speaker: $(element).children(".talk-link__speaker").text(),
        date_posted: $(element).children().children(".meta__item").children(".meta__val").text(),
        classification: $(element).children().children(".meta__row").children(".meta__val").text(),
        saved: false
      }
      if (prevlinks.includes(articleDetails.link.toString())) {
        console.log(`this article has already been scraped`)
      } else {
        currentArticles.push(articleDetails);
        prevlinks.push(articleDetails.link);
        counter++;
      }
      // returns 20 Ted Talks   
      return counter < 20;
    });
    insertNewArticles(currentArticles, res);
  });
});



//--------------------------------------
// Export routes for server.js to use.
//--------------------------------------
module.exports = router;