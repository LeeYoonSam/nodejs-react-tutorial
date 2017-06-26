// Router 를 생성.
var express = require("express");
var router = express.Router();

var UserModel = require("../models/UserModel");
var passwordHash = require("../libs/passwordHash");

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// === passport 정책 선언 시작 ===
/* 
로그인이 성공하면, serializeUser 메서드를 이용하여 사용자 정보를 session에 저장할 수 있다. 
세션에 저장할 정보를 done 함수의 두번째 인자로 넘긴다. 
*/
passport.serializeUser(function(user, done) {
  console.log("serializeUser");
  console.log("user: " + user);
  done(null, user);
});

/* 
모든 페이지에 접근할때, 로그인이 되어 있을 경우 모든 사용자 페이지를 접근할 경우 deserilizeUser가 발생
deserializeUser에서는 session에 저장된 값을 이용해서, 사용자 Profile을 찾는다.
로그인 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
*/
passport.deserializeUser(function(user, done) {
  var result = user;
  result.password = "";
  console.log("deserializeUser");
  console.log("result: " + result);
  done(null, result);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, username, password, done) {
      UserModel.findOne(
        { username: username, password: passwordHash(password) },
        function(err, user) {
          if (!user) {
            return done(null, false, { message: "아이디 또는 비밀번호 오류 입니다." });
          } else {
            return done(null, user);
          }
        }
      );
    }
  )
);

// === passport 정책 선언 끝 ===

router.get("/", (req, res) => {
  res.render("accounts/login");
});

// 회원가입
router.get("/join", (req, res) => {
  res.render("accounts/join");
});

router.post("/join", (req, res) => {
  var user = new UserModel({
    username: req.body.username,
    password: passwordHash(req.body.password)
  });

  // validation 확인
  var validationError = user.validateSync();
  if (!validationError) {
    // save 함수를 사용해서 db insert
    user.save(err => {
      res.send(
        '<script>alert("회원가입 성공");location.href="/accounts/login";</script>'
      );
    });
  } else {
    res.send(validationError);
  }
});

// 로그인
router.get("/login", function(req, res) {
  res.render("accounts/login", { flashMessage: req.flash().error });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/accounts/login",
    failureFlash: true
  }),
  function(req, res) {
    console.log("call passport callback");
    res.send('<script>alert("로그인 성공");location.href="/posts";</script>');
  }
);

router.get("/success", function(req, res) {
  res.send(req.user);
});

// 로그아웃
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/accounts/login");
});

module.exports = router;
