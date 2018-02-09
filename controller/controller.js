var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var rp = require('request-promise');
const eachPromise = require('each-promise')
var mongojs = require("mongojs");
var router = express.Router();
var Articles = require("../models/articles.js");

// var prevTitleObject = require("./controller/prevTitleObject");
const prevlinks = [];
//=================================================
// Functions
//=================================================
function initializePreviouslinksArray() {
  prevlinks.length = 0;
  Articles.find({})
    .then(function (data) {
      data.forEach(function (element) {
        prevlinks.push(element.link);
        console.log("element.link: " + element.link);
        console.log("prevlinks: " + prevlinks[prevlinks.indexOf(element.link)]);
      });
      console.log(`Previouslinks ${prevlinks.toString()}`);
    }).catch(function (error) {
      // Throw any errors to the console
      console.log("DB Error from initializePreviouslinksArray")
      console.log(error);
    });
}

function searchForPreviousInserts(link) {
  Articles.find().where('link').equals(link)
    .then(function (data) {
      console.log("DATA");
      console.log(data);
      return true;
    }).catch(function (error) {
      // Throw any errors to the console
      console.log("DB Error from searchForPreviousInserts")
      console.log(error);
    });
}


// function checkForPreviousInserts(title) {
//   console.log(title);
//   console.log(previousTitles.toString());
//   console.log("prevTitles includes title" + previousTitles.includes(title));
//   return previousTitles.includes(title);
// }
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

// function insertOneNewArticles(articleDetails, res) {
//   console.log("im in insertOneNewArticles");
//   console.log("dumping articleDetails ");
//   console.log(articleDetails);
//   Articles.insert(articleDetails)
//     .then(function (err, data) {
//       console.log("inserted");
//       // console.log("inserted this many: " + data.insertedCount);
//       console.log(data);
//       // let result = data.length.toString();
//       // console.log("RESULT" + result);
//       // res.send(result);
//       return true;
//     }).catch(function (err, data) {
//       console.log("There was a DB error - insertOneNewArticles");
//       console.log(err);
//       res.status(500).end();
//     });
// }


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
  Articles.findByIdAndUpdate(req.params.id, {
    $set: {
      saved: req.body.saved
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

function displayNotesInModal(req, res) {
  console.log("im in displayNotesInModal");
  Articles.findById(req.params.id)
    .then(function (data) {
      console.log(data);
      const prevNotes = [];
      for (let i = 0; i < data.notes.length; i++) {
        console.log(data.notes[i]);
        prevNotes.push({
          "noteId": i,
          "note": data.notes[i]
        });
      }
      console.log("prevNotes:");
      console.log(prevNotes);
      res.render("saved", {
        prevNotes: prevNotes
      });
    }).catch(function (err) {
      console.log("There was a DB error - displayNotesInModal");
      console.log(err);
      res.status(500).send("A Server Error Occurred");
    });
}


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
    const prevNotes = [];
    for (let i = 0; i < data.notes.length; i++) {
      console.log(data.notes[i]);
      prevNotes.push({
        "noteId": i,
        "note": data.notes[i]
      });
    }
    console.log("prevNotes:");
    console.log(prevNotes);
    res.render("saved", {
      prevNote: prevNotes
    });
  }).catch(function (err) {
    console.log("There was a DB error - addANote");
    console.log(err);
    res.status(500).send("A Server Error Occurred");
  });
}

// function addANote(req, res) {
// console.log("im in addANote");
// console.log('req.body and req.params:');
// // console.log("im about to update");
// // console.log(req.body);
// // console.log(req.params);

// Articles.findByIdAndUpdate(req.params.id, 
//   { $addToSet: { notes: '<value1>' }, 
//  Articles.update(
//    {_id: req.params.id}, 
// {$addToSet: {notes: [req.body.note]}
// Articles.update({
//     "_id": req.params.id
//   }, {
//     push: {
//       "note": "note"
//     }
//   }, {
//     validateBeforeSave: false,
//     upsert: false
//   },
//   function (err, model) {
//     console.log(model);
//     console.log(err);
//   }
// );
// }
// }).then(function (data) {
//   console.log(data);
//   res.send("success");
// }).catch(function (err) {
//   console.log("There was a DB error - addANote");
//   console.log(err);
//   res.status(500).send("A Server Error Occurred");
// });


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
  initializePreviouslinksArray();
  getPreviouslyScrapedArticles(req, res);
});

// router.get("/home", function (req, res) {
//   getPreviouslyScrapedArticles();
// });

router.get("/saved", function (req, res) {
  console.log("IM ON THE SERVER SIDE FOR SAVED");
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
// Route to update the  saved article with a new  
// note, from the saved page
//----------------------------------------------
router.put("/api/note/:id", function (req, res) {
  addANote(req, res);
});

//----------------------------------------------
// Route to populate the previous notes  
// in the modal on the saved page
//----------------------------------------------
router.get("/api/prevnotes/:id", function (req, res) {
  displayNotesInModal(req, res);
});


// request("https://www.ted.com/talks", function (error, response, html) {
//   // Load the html body from request into cheerio
//   var $ = cheerio.load(html);
//   // For each element with a "title" class
//    const currentArticles = [];
//     let counter = 0;
//   $(".media__message").each(function (i, element) {
//     console.log("Im in media message");
//     // Save the text and href of each link enclosed in the current element
//     var title = $(element).children().children("a").text();
//     // var link = "https://www.ted.com" + $(element).children().children("a").attr("href");
//     var link = $(element).children().children("a").attr("href");
//     var speaker = $(element).children(".talk-link__speaker").text();
//     var date_posted = $(element).children().children(".meta__item").children(".meta__val").text();
//     var classification = $(element).children().children(".meta__row").children(".meta__val").text();
//       Articles.findOne().where('title').equals(element.title)
//         .then(function (error, data) {
//           console.log("DATA");
//           console.log(data);
//          currentArticles.push(articleDetails);
//             counter++;
//          let articleDetails = {
//               title: $(element).children().children("a").text(),
//               // var link = "https://www.ted.com" + $(element).children().children("a").attr("href");
//               link: $(element).children().children("a").attr("href"),
//               speaker: $(element).children(".talk-link__speaker").text(),
//               date_posted: $(element).children().children(".meta__item").children(".meta__val").text(),
//               classification: $(element).children().children(".meta__row").children(".meta__val").text(),
//               saved: false
//             }
//             currentArticles.push(articleDetails);
//             counter++;
//             if (counter == 5) {
//               console.log("counter5 " + counter);
//               insertNewArticles(currentArticles, res);
//               return false;
//             }

//         }).catch(function (error, data) {
//           // Throw any errors to the console
//           console.log("DB Error from searchForPreviousInserts")
//           console.log(error);
//         });
//     });
//   });
//         });
//     }
//     //returns 20 Ted Talks
//     return i < 5;
//   });
// });


// router.get("/scrape", function (req, res) {
//   request("https://www.ted.com/talks", function (error, response, html) {
//     // Load the html body from request into cheerio

//     const $ = cheerio.load(html);
//     const currentArticles = [];
//     let counter = 0;
//     console.log("counter1 " + counter);
//     // For each element with a "media__message" class
//     $(".media__message").each((i, element) => {
//       console.log("Im in media message");
//       console.log("counter2 " + counter);
//       // console.log(element);
//       var title1 = $(element).children().children("a").text();
//       // let isRepeatTitle = searchForPreviousInserts(element.title);
//       Articles.findOne().where('title').equals(title1)
//         .then(function (error, found) {
//           console.log("FOUND: " + JSON.stringify(found, null, 2));
//           let continueLoop = true;
//           if (!found) {
//             // Save the text and href of each link enclosed in the current element
//             let articleDetails = {
//               title: $(element).children().children("a").text(),
//               // var link = "https://www.ted.com" + $(element).children().children("a").attr("href");
//               link: $(element).children().children("a").attr("href"),
//               speaker: $(element).children(".talk-link__speaker").text(),
//               date_posted: $(element).children().children(".meta__item").children(".meta__val").text(),
//               classification: $(element).children().children(".meta__row").children(".meta__val").text(),
//               saved: false
//             }
//             // insertOneNewArticles(articleDetails, res);
//             counter++;
//             console.log("counter3 " + counter);
//             if (counter < 3) {
//               currentArticles.push(articleDetails);
//               // insertNewArticles(currentArticles, res);
//             } else if (counter = 3) {
//               currentArticles.push(articleDetails);
//               insertNewArticles(currentArticles, res);
//               continueLoop = false;
//             } else if (counter > 3) {
//               continueLoop = false;
//             }
//           } else { //if article is found
//             console.log("article previously inserted: " + JSON.stringify(data));
//           }
//           return continueLoop;
//           // console.log("counter6 " + counter);
//           // insertNewArticles(currentArticles, res);
//         }).catch(function (error, data) {
//           // Throw any errors to the console
//           console.log("DB Error from searchForPreviousInserts")
//           console.log(error);
//         });
//     });
//   });
// });

router.get("/scrape", function (req, res) {
  request("https://www.ted.com/talks", function (error, response, html) {
    // Load the html body from request into cheerio

    const $ = cheerio.load(html);
    const currentArticles = [];
    let counter = 0;
    console.log("counter1 " + counter);
    // For each element with a "media__message" class
    $(".media__message").each((i, element) => {
      console.log("Im in media message");
      console.log("counter2 " + counter);
      // console.log(element);
      let articleDetails = {
        title: $(element).children().children("a").text(),
        // var link = "https://www.ted.com" + $(element).children().children("a").attr("href");
        link: $(element).children().children("a").attr("href"),
        speaker: $(element).children(".talk-link__speaker").text(),
        date_posted: $(element).children().children(".meta__item").children(".meta__val").text(),
        classification: $(element).children().children(".meta__row").children(".meta__val").text(),
        saved: false
      }
      console.log("im about to do the if prevlinks");
      console.log(`articleDetails.link  *${articleDetails.link}*`);
      console.log(`prevlinks0 *${prevlinks[0]}*`);
      console.log(`prevlinks1 *${prevlinks[1]}*`);
      if (prevlinks.includes(articleDetails.link.toString())) {
        console.log("prevlinks includes link")
      }else{
        console.log("prevlinks doesnt includes link")
        currentArticles.push(articleDetails);
        prevlinks.push(articleDetails.link);
        counter++;
      }
      // returns 20 Ted Talks   
      return counter < 2;
    });
    console.log("dumping CURRENTARTICLES");
    console.log(currentArticles);
    insertNewArticles(currentArticles, res);
  });
});






// let isRepeatTitle = checkForPreviousInserts(articleDetails.title);

//       console.log(`isRepeatTitle ${isRepeatTitle}`);
//       if (isRepeatTitle) {
//         console.log(`this is a repeat title ${articleDetails.title}`);
//       } else {
//         currentArticles.push(articleDetails);
//         // previousTitles.push(articleDetails.title);
//         console.log("counter3 " + counter);
//         counter++;
//         console.log("counter4 " + counter);
//       }
//       //limits the Ted Talks returned to 20
//       if (counter == 5) {
//         console.log("counter5 " + counter);
//         console.log("counter6 " + counter);
//         insertNewArticles(currentArticles, res);
//         return false;
//       }
//     });
//   });
// });



//--------------------------------------
// Export routes for server.js to use.
//--------------------------------------
module.exports = router;