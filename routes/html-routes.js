const express = require("express");

// Our scraping tools
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

//Import mongoose
const mongoose = require("mongoose");

// Import the models
const db = require("../models");

mongoose.connect("mongodb://localhost/scrapoogle");

module.exports = function (app) {


    // A GET route for scraping a site
    app.get("/", function (req, res) {

        axios.get('https://news.google.com/')

            .then(function (response) {
                let $ = cheerio.load(response.data);

                $("article a").each(function (i, element) {
                    // console.log(element);

                    let result = {};

                    result.title = $(this)
                        .children("span")
                        .text();
                    result.link = $(this)
                        .attr("href");

                    if (result.title !== "" && result.link !== "") {
                        db.Article.create(result)
                            .then(function (dbArticle) {
                                // View the added result in the console
                                console.log(dbArticle);
                            })
                            .catch(function (err) {
                                // If an error occurred, send it to the client
                                return res.json(err);
                            });

                    }

                })
                console.log("scraping done.");
            })

            .catch(function (error) {
                console.log(error);
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