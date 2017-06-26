var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var autoIncrement = require("mongoose-auto-increment");

var UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "아이디는 필수 입니다."]
  },

  displayname: String,

  password: {
    type: String,
    required: [true, "패스워드는 필수 입니다."]
  },

  create_at: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.plugin(autoIncrement.plugin, {
  model: "user",
  field: "id",
  startAt: 1
});

module.exports = mongoose.model("user", UserSchema);
