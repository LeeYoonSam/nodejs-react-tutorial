// Router 를 생성.
var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("chat/chat");
});

module.exports = router;
