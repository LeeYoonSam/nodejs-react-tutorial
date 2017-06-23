// Router 를 생성.
var express = require("express");
var router = express.Router();

var PostModel = require("../models/PostModel");
var CommentModel = require("../models/CommentModel");

// csrf 셋팅
var csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });

// ===== Multer 세팅 관련 =====
var path = require("path");
var uploadDir = path.join(__dirname, "../uploads");
var fs = require("fs");

//multer 셋팅
var multer = require("multer");
var storage = multer.diskStorage({
  // 저장경로
  destination: function(req, file, callback) {
    callback(null, uploadDir);
  },
  // 파일명 설정
  filename: function(req, file, callback) {
    callback(null, "posts-" + Date.now() + "." + file.mimetype.split("/")[1]);
  }
});

var upload = multer({ storage: storage });
// ===== Multer 세팅 관련 끝 =====

// === POST 관련 ===
router.get("/", (req, res) => {
  // mongodb find = query의 select 역할
  PostModel.find({}, function(err, posts) {
    // 디비에서 가져온 데이터를 뷰로 넘기기
    res.render("posts/list", {
      posts: posts
    });
  });
});

router.get("/write", csrfProtection, function(req, res) {
  res.render("posts/form", {
    post: "",
    csrfToken: req.csrfToken()
  });
});

router.post("/write", upload.single("thumbnail"), csrfProtection, function(
  req,
  res
) {
  // Schema를 생성해놓은 객체를 사용해서 데이터를 세팅
  var post = new PostModel({
    title: req.body.title,
    content: req.body.content,
    thumbnail: req.file ? req.file.filename : ""
  });

  // validation 확인
  var validationError = post.validateSync();
  if (!validationError) {
    // save 함수를 사용해서 db insert
    post.save(function(err) {
      res.redirect("/posts");
    });
  } else {
    res.send(validationError);
  }
});

router.get("/detail/:id", csrfProtection, function(req, res) {
  // 파라미터로 넘겨져 오면 req.params. , input 등으로 넘겨져 오면 req.body. 사용
  // MongoDB에서 id에 해당하는 글만 가져와서 detail render
  PostModel.findOne({ id: req.params.id }, function(error, post) {
    // 코멘트 부분 같이 가져오기 위해 수정
    CommentModel.find({ post_id: req.params.id }, function(err, comments) {
      res.render("posts/detail", {
        post: post,
        comments: comments,
        csrfToken: req.csrfToken()
      });
    });
  });
});

router.get("/delete/:id", function(req, res) {
  // MongoDB remove = Query delete
  // id에 해당하는 글 삭제 후 목록으로 이동
  PostModel.findOne({ id: req.params.id }, function(error, post) {
    // 해당 게시글에 이미지가 있으면 uploads 폴더에서 삭제 해준다.
    if (post.thumbnail) {
      fs.unlinkSync(uploadDir + "/" + post.thumbnail);
    }

    PostModel.remove(
      {
        id: req.params.id
      },
      function(err) {
        res.redirect("/posts");
      }
    );
  });
});

router.get("/edit/:id", csrfProtection, function(req, res) {
  // 넘겨 받은 id와 일치하는 글을 불러와서 원래 작성된 내용을 복원해준다.
  PostModel.findOne(
    {
      id: req.params.id
    },
    function(error, post) {
      res.render("posts/form", {
        post: post,
        csrfToken: req.csrfToken()
      });
    }
  );
});

router.post("/edit/:id", upload.single("thumbnail"), csrfProtection, function(
  req,
  res
) {
  //그 이전 파일명을 먼저 받아온다.
  PostModel.findOne(
    {
      id: req.params.id
    },
    function(err, post) {
      if (req.file) {
        if (post.thumbnail) {
          //요청중에 파일이 존재 할시 이전이미지 지운다.
          fs.unlinkSync(uploadDir + "/" + post.thumbnail);
        }
      }

      // 수정된 내용을 객체에 담아서 MongoDB.update
      var query = {
        title: req.body.title,
        content: req.body.content,
        thumbnail: req.file ? req.file.filename : post.thumbnail
      };

      var post = new PostModel(query);
      if (!post.validateSync()) {
        PostModel.update(
          {
            id: req.params.id
          },
          {
            $set: query
          },
          function(err) {
            res.redirect("/posts/detail/" + req.params.id);
          }
        );
      }
    }
  );
});

router.post("/ajax_comment/insert", csrfProtection, function(req, res) {
  var comment = new CommentModel({
    content: req.body.content,
    post_id: parseInt(req.body.post_id)
  });

  comment.save(function(err, comment) {
    res.json({
      id: comment.id,
      content: comment.content,
      message: "success"
    });
  });
});

router.post("/ajax_comment/delete", function(req, res) {
  CommentModel.remove({ id: req.body.comment_id }, function(err) {
    res.json({ message: "success" });
  });
});

module.exports = router;
