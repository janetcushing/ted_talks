// var express = require("express");
// var request = require("request");
// var cheerio = require("cheerio");
// var rp = require('request-promise');
// const eachPromise = require('each-promise')
var mongojs = require("mongojs");
// var router = express.Router();
var Articles = require("../models/articles.js");


const prevTitles = [];
//=================================================
// Functions
//=================================================
function initializePreviousTitlesArray() {
  prevTitles.length = 0;
  Articles.find({})
    .then(function (data) {
      data.forEach(function (element) {
        prevTitles.push(element.title);
      });
      console.log(`PreviousTitles ${prevTitles.toString()}`);
    }).catch(function (error) {
      // Throw any errors to the console
      console.log("DB Error from initializePreviousTitlesArray")
      console.log(error);
    });
}

var prevTitleObject = {prevTitles, initializePreviousTitlesArray()};

module.exports = prevTitleObject;
