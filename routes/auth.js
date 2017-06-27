var router = require("express").Router();
var UserModel = require("../models/UserModel");
var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;

var { clientID, clientSecret } = require("../AppClientID");

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      // https://developers.facebook.com에서 appId 및 scretID 발급
      clientID: clientID, //입력하세요
      clientSecret: clientSecret, //입력하세요.
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"] //받고 싶은 필드 나열
    },
    function(accessToken, refreshToken, profile, done) {
      UserModel.findOne({ username: profile._json.email }, function(err, user) {
        // 해당하는 유저가 존재하지 않으면 회원가입 후 로그인 성공페이지 이동
        if (!user) {
          var regData = {
            username: profile._json.email,
            password: "facebook_login"
          };

          var User = new UserModel(regData);
          User.save(function(err) {
            done(null, regData); // 세션 등록
          });
        } else {
          // 해당하는 유저가 존재하면 DB에서 가져온 정보로 세션 등록
          done(null, user);
        }
      });
    }
  )
);

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

// 인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/auth/facebook/fail"
  })
);

// 로그인 성공
router.get("/facebook/success", function(req, res) {
  res.send(req.user);
});

// 로그인 실패
router.get("/facebook/fail", function(req, res) {
  res.send("facebook login fail");
});

module.exports = router;
