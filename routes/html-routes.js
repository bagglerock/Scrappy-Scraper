const express = require("express");

// Our scraping tools
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

//Import mongoose
const mongoose = require("mongoose");

// Import the models
const db = require("../models");

// mongoose.connect("mongodb://localhost/scrapoogle");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapoogle";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

module.exports = function (app) {


    // A GET route for scraping a site
    app.get("/update/", function (req, res) {
        console.log("route has been hit");
        //let count = 0;
        let newArticles = [];
        //let unenteredArticles = [];
        axios.get('https://news.google.com/').then(function (response) {
                let $ = cheerio.load(response.data);
                $("article a").each(function (i, element) {

                    let result = {};
                    result.title = $(this).children("span").text();
                    result.link = $(this).attr("href");

                    if (result.title !== "" && result.link !== "") {
                        newArticles.push(result);
                    }

                })
                // the find() is async and fires out the create in a weird order which screws up the count for added articles
                // loop through the newArticles array
                for (let i = 0; i < newArticles.length; i++) {
                    // check to see if the article exists in the database(async)
                    db.Article.find({
                        title: newArticles[i].title
                        // after that check is done do stuff
                    }).exec(function (err, doc) {
                        // if error just say something
                        if (err) {console.log("error was hit");}
                        // if document exists then mention it
                        if (doc.length) {
                            console.log('Review already exists!');
                            //otherwise it does not exist so add it to the database
                        } else {
        
                            console.log("should be adding");
                            db.Article.create(newArticles[i]).then(function (dbArticle) {
                                console.log("added a new article");
                                console.log(i + " and " + newArticles.length);
                                if (i === (newArticles.length) - 1) {
                                    
                                    console.log(count + " articles were added");
                                }
                                //console.log(dbArticle);
                            })
                        }
                        
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
                //res.send(error);
            });
        //res.end();
        res.redirect("/");
    });


    // Route for getting all Articles from the db
    app.get("/", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({}).sort({
                _id: -1
            })
            .limit(100)
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                let hbsObject = {
                    results: dbArticle
                }
                res.render("index", hbsObject);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });


    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {

        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({
                _id: req.params.id
            })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });


    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {


    });


};