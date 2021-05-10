const port = 3000;

// Instantiate Express Application
const express = require("express");
const app = express();

// Parsing requests
const bodyParser = require("body-parser");

// EJS templating engine
const ejs = require("ejs");

// Utils for URL string transformations
const _ = require("lodash");
const slugify = require("slugify");

// Creating Database
const mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost:27017/postsDB", { useNewUrlParser: true, useUnifiedTopology: true});

// Reporting on database connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to database.")
})

// Create Schema
const postSchema = new mongoose.Schema ({
  postTitleLC: String,
  postTitle: String,
  postBody: String
});

const userSchema = new mongoose.Schema ({
  userName: String,
  userEmail: String
});

// Create Model
const Post = mongoose.model("Post", postSchema);

// Set ejs templating engine
app.set('view engine', 'ejs');

// No idea
app.use(bodyParser.urlencoded({extended: true}));

// Serving static content
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  Post.find({}, function(err, posts) {
    if(err){
      console.log(err);
    } else {
      res.render("home", {posts:posts});
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", {});
});

app.get("/contact", (req, res) => {
  res.render("contact", {});
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    postTitleLC: _.lowerCase(req.body.postTitle),
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  })
  post.save();
  postSlug = slugify(_.lowerCase(req.body.postTitle));
  res.redirect("/posts/"+postSlug);
});

app.get("/posts/:postSlug", (req, res) => {
  if (req.params.post) {
    var postSlug = req.params.post.postTitleLC;
    console.log(postSlug);
  } else {
    var postSlug = _.lowerCase(req.params.postSlug);
  }
  Post.findOne({postTitleLC: postSlug}, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      res.render("post", {post:post}) }
  });
});

app.get("/posts/update/:postSlug", (req, res) => {
  var postSlug = _.lowerCase(req.params.postSlug);
  Post.findOne({postTitleLC: postSlug}, function(err, post) {
    if(err) {
      console.log(err);
      res.redirect("/");
    } else {
      posts = Post.find({},function(err, posts){
        if(err) {
          console.log(err)
        } else {
          res.render("home", {posts:posts})
        }
      });
    }
  });
});

app.post("/posts/update/:postSlug", (req, res) => {
  var postSlug = _.lowerCase(req.params.postSlug);
  const post = new Post({
    postTitleLC: _.lowerCase(req.body.postTitle),
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  })
  Post.updateOne({postTitleLC: postSlug}, 
    {postTitleLC: postTitleLC,
    postTitle: postTitle,
    postBody: postBody}, 
    function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Successfully updated the post.");
      };
    });
  post.save();
  postSlug = slugify(_.lowerCase(req.body.postTitle));
  res.redirect("/posts/"+postSlug, {post: post});
});

app.get("/posts/delete/:postSlug", (req, res) => {
  var postSlug = _.lowerCase(req.params.postSlug);
  Post.deleteOne({postTitleLC: postSlug}, function(err, post) {
    if(err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/404", (req, res) => {
  
  res.render("404", {text:""});
})

app.listen(port, () => {
  console.log('Server running on: http://localhost:' + port);
});
