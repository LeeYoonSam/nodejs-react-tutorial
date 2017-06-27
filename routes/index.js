var express = require("express");
var router = express.Router();

var PostModel = require("../models/PostModel");

/* GET home page. */
router.get("/", function(req, res, next) {
  PostModel.find({}, function(err, posts) {
    var tempPost = [];

    //  썸네일이 있는 포스트만 필터링
    posts.filter(post => {
      if (post.thumbnail) tempPost.push(post);
    });

    res.render("./index", { posts: tempPost });
  });
});

module.exports = router;
