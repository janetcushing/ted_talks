// var mongojs = require("mongojs");

// // Database configuration
// var databaseUrl = "ted_talks";
// var collections = ["articles", "savedArticles"];

// // Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

// module.exports = db;

///////////////////////
// Require mongoose
var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExampleSchema object
// This is similar to a Sequelize model
var ArticlesSchema = new Schema({
  // `string` must be of type String. We "trim" it to remove any trailing white space
  // `string` is a required field, and a custom error message is thrown if it is not supplied
  title: {
    type: String,
    trim: true,
    required: "title is Required",
    validate: [
      // Function takes in the new `longstring` value to be saved as an argument
      function(input) {
        // If this returns true, proceed. If not, return the error message below
        return input.length >= 1;
      },
      // Error Message
      "Longstring should be longer."
    ]
  },
  link: {
    type: String,
    trim: true,
    required: "link is Required"
  },
  speaker: {
    type: String,
    trim: true,
    required: "speaker is Required"
  },
  date_posted: {
    type: String,
    trim: true,
    required: "date posted is Required"
  },
  classification: {
    type: String,
    trim: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  notes: { 
  type: Array
  },
  insertDate: {
    type: Date,
    default: Date.now
  },
 
});

// This creates our model from the above schema, using mongoose's model method
var Articles = mongoose.model("Articles", ArticlesSchema);

// Export the Example model
module.exports = Articles;
