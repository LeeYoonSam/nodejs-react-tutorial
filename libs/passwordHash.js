var crypto = require("crypto");
var mysalt = "yourSalt";

// Node.js 내장 모듈을 사용해서 암호화
module.exports = function(password) {
  return crypto.createHash("sha512").update(password + mysalt).digest("base64");
};
