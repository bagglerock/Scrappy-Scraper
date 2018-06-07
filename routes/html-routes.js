const express = require("express");
const request = require("request");
// Our scraping tools
// It works on the client and on the server
const cheerio = require("cheerio");

module.exports = function (app) {


    // A GET route for scraping a site
    app.get("/", function (req, res) {
        request("https://old.reddit.com/r/webdev/", function (error, response, html) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(html);

            // An empty array to save the data that we'll scrape
            var results = [];
            var hbsObject = {};

            // With cheerio, find each p-tag with the "title" class
            // (i: iterator. element: the current element)
            $("p.title").each(function (i, element) {

                // Save the text of the element in a "title" variable
                var title = $(element).text();

                // In the currently selected element, look at its child elements (i.e., its a-tags),
                // then save the values for any "href" attributes that the child elements may have
                var link = $(element).children().attr("href");

                // Save these results in an object that we'll push into the results array we defined earlier
                results.push(
                    {
                        title: title,
                        link: link
                    }
                );
                hbsObject = {
                    results: results
                }
            });
            res.render("index", hbsObject);
        });
        
    });


    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {

    });


    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {

    });


    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {

    });


};