// Bring in our Models: Not and User
var Article = require("../models/Article.js");
var Author = require("../models/Author.js");
var request = require("request");
var cheerio = require("cheerio");

module.exports = function (app) {
  // Main route (simple Hello World Message)
  app.get("/", function (req, res) {
    res.send("Hello world");
  });

  // Retrieve data from the db
  app.get("/all", function (req, res) {
    // Find all results from the scrapedData collection in the db
    Article.scrapedData.find({}, function (error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as a json
      else {
        res.json(found);
      }
    });
  });

  // Scrape data from one site and place it into the mongodb db
  app.get("/scrape", function (req, res) {
    // Make a request for the news section of ycombinator
    request("https://news.ycombinator.com/", function (error, response, html) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $(".title").each(function (i, element) {
        // Save the text of each link enclosed in the current element
        var title = $(this).children("a").text();
        // Save the href value of each link enclosed in the current element
        var link = $(this).children("a").attr("href");

        // If this title element had both a title and a link
        if (title && link) {
          // Save the data in the scrapedData db
          console.log(title);
          console.log(link);
          Article.scrapedData.save({
            title: title,
            link: link
          },
            function (error, saved) {
              // If there's an error during this query
              if (error) {
                // Log the error
                console.log(error);
              }
              // Otherwise,
              else {
                // Log the saved data
                console.log(saved);
              }
            });
        }
      });
    });

    // This will send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });
}