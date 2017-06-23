var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

// === 몽고디비 관련 세팅 시작 ===
var mongoose = require("mongoose");
/*
mongoose v4 이상의 버전부터 mongoose의 save()와 쿼리같은 비동기 동작에서는 Promises/A+ conformant pomises를 반환하게 되어있다.
*/
mongoose.Promise = global.Promise;

var autoIncrement = require("mongoose-auto-increment");

// 몽구스 연결 상태 로그 - 몽고 디비가 연결되면 console에 표시(없어도 상관없음)
var db = mongoose.connection;
db.on("error", console.error);
db.on("open", function() {
  console.log("MongoDB Connect");
});

// 몽고디비 연결 - 'board' 라는 DB를 사용
var connect = mongoose.connect("mongodb://127.0.0.1:27017/board");

// autoIncrement 초기화
autoIncrement.initialize(connect);
// === 몽고디비 관련 세팅 끝 ===

// 라우트 관련 세팅
var index = require("./routes/index");
var users = require("./routes/users");
// routes 가져오기
var posts = require("./routes/posts");
var accounts = require("./routes/accounts");
var chat = require("./routes/chat");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 업로드 path 추가
app.use("/uploads", express.static("uploads"));

app.use("/", index);
app.use("/users", users);

// routes 추가
app.use("/posts", posts);
app.use("/accounts", accounts);
app.use("/chat", chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
