// Router 를 생성.
var express = require("express");
var router = express.Router();

var PostModel = require("../models/PostModel");

// === POST 관련 ===
router.get("/", (req, res) => {
  // mongodb find = query의 select 역할
  PostModel.find({}, function(err, posts) {
    // 디비에서 가져온 데이터를 뷰로 넘기기
    res.render("posts/list", { posts: posts });
  });
});

router.get("/write", function(req, res) {
  res.render("posts/form");
});

router.post("/write", function(req, res) {
  // Schema를 생성해놓은 객체를 사용해서 데이터를 세팅
  var post = new PostModel({
    title: req.body.title,
    content: req.body.content
  });

  // validation 확인
  var validationError = post.validateSync();
  if (!validationError) {
    // save 함수를 사용해서 db insert
    post.save(function(err) {
      res.redirect("/posts");
    });
  }
});

router.get("/detail/:id", function(req, res) {
  // 파라미터로 넘겨져 오면 req.params. , input 등으로 넘겨져 오면 req.body. 사용
  // MongoDB에서 id에 해당하는 글만 가져와서 detail render
  PostModel.findOne({ id: req.params.id }, function(error, post) {
    res.render("posts/detail", { post });
  });
});

router.get("/delete/:id", function(req, res) {
  // MongoDB remove = Query delete
  // id에 해당하는 글 삭제 후 목록으로 이동
  PostModel.remove({ id: req.params.id }, function(err) {
    res.redirect("/posts");
  });
});

module.exports = router;
