// Router 를 생성.
var express = require("express");
var router = express.Router();

// === POST 관련 ===
router.get("/", (req, res) => {
  res.end("posts");
});

module.exports = router;
