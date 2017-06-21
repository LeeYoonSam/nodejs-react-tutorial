// Router 를 생성.
var express = require("express");
var router = express.Router();

// === POST 관련 ===
router.get("/", (req, res) => {
  res.render("posts/list");
});

router.get("/write", function(req, res) {
  res.render("posts/form");
});

module.exports = router;
