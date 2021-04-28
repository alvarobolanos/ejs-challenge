const port = 3000;

// Instantiate Express Application
const express = require("express");
const app = express();

// Other Requirements
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose"); 

// Set ejs templating engine
app.set('view engine', 'ejs');

// No idea
app.use(bodyParser.urlencoded({extended: true}));

// Serving static content
app.use(express.static("public"));

posts=[];

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about", {});
});

app.get("/contact", (req, res) => {
  res.render("contact", {});
});

app.get("/compose", (req, res) => {
  res.render("compose", {
    posts:posts
  });
});

app.post("/compose", (req, res) => {
  const post = {
    postTitleLC : _.lowerCase([req.body.postTitle]),
    postTitle : req.body.postTitle,
    postBody : req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:postSlug", (req, res) => {
  var postSlug = _.lowerCase([req.params.postSlug]);

  try {

    posts.forEach(function(post){
      const postTitleLC = post.postTitleLC;

      if(postSlug === postTitleLC) {
        res.render("post", {
          postTitle: post.postTitle,
          postBody: post.postBody
        });
      }
    });
  }
  catch (error) {
    console.log(error);
  }
});

app.get("/404", (req, res) => {
  
  res.render("404", {text:""});
})

app.listen(port, () => {
  console.log('Server running on: http://localhost:' + port);
});
