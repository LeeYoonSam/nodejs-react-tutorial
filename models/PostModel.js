var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var autoIncrement = require("mongoose-auto-increment");

var PostSchema = new Schema({
  title: {
    type: String,
    required: [true, "제목을 입력해주세요"] // validation 처리
  },
  content: {
    type: String,
    required: [true, "내용을 입력해주세요"] // validation 처리
  },
  thumbnail: String,
  created_at: {
    type: Date,
    default: Date.now()
  },
  username: String // 작성자
});

// 함수를 만들어서 날짜 가공
PostSchema.virtual("getDate").get(function() {
  var date = new Date(this.created_at);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
});

// autoincrement 사용(모델명: mongodb collection 생성, 필드명, 시작값을 설정한다.)
PostSchema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "id",
  startAt: 1
});

module.exports = mongoose.model("post", PostSchema);
