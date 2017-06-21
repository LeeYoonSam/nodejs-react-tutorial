// Router 를 생성.
var express = require("express");
var router = express.Router();

// === POST 관련 ===

// 회원가입
router.get("/join", (req, res) => {
  res.render("accounts/join");
});

// 로그인
router.get("/login", (req, res) => {
  res.render("accounts/login");
});

module.exports = router;
