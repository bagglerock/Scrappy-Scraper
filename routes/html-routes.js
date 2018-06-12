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

function findArticle(article) {
    let promise = new Promise(function (resolve, reject) {
        db.Article.find({
            title: article.title
        }).exec(function (err, doc) {
            if (doc.length > 0) {
                article.isSaved = true;
                resolve(article);
            } else if (doc.length === 0) {
                //change article flag
                resolve(article);
            } else {
                reject("an error has occured");
            }
        })
    })
    return promise;
}


module.exports = function (app) {

    // A GET route for scraping a site
    app.get("/", function (req, res) {
        console.log("route has been hit");
        let scrapedArticles = [];
        let newArticles = [];
        let count = 0;
        let promises = [];
        axios.get('https://news.google.com/').then(function (response) {
                let $ = cheerio.load(response.data);
                $("article a").each(function (i, element) {

                    let result = {};
                    result.title = $(this).children("span").text();
                    result.link = $(this).attr("href");
                    result.isSaved = false;

                    if (result.title !== "" && result.link !== "") {
                        scrapedArticles.push(result);
                    }

                })

                for (let i = 0; i < scrapedArticles.length; i++) {
                    promises.push(findArticle(scrapedArticles[i]));
                }
                Promise.all(promises).then(function (checkedArticles) {
                    newArticleCount = 0;
                    for (let i = 0; i < checkedArticles.length; i++) {
                        if(!checkedArticles[i].isSaved){
                            newArticleCount++;
                        }
                        newArticles.push(checkedArticles[i]);
                    }
                    console.log(newArticles);
                    console.log(newArticleCount);

                    let hbsObject = {
                        newArticles: newArticles,
                        newArticleCount: newArticleCount
                    }
                    res.render("index", hbsObject);
                })

            })
            .catch(function (error) {
                console.log(error);
                res.send(error);
            });
    });




    // Route for getting all Articles from the db
    //this has to be changed to get articles from the database that were saved
    app.get("/saved", function (req, res) {
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