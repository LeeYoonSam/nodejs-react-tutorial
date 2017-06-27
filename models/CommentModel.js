var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var autoIncrement = require("mongoose-auto-increment");

var CommentSchema = new Schema({
  content: String,
  post_id: Number,
  create_at: {
    type: Date,
    default: Date.now()
  }
});

CommentSchema.virtual("getDate").get(function() {
  var date = new Date(this.create_at);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
});

CommentSchema.plugin(autoIncrement.plugin, {
  model: "comment",
  field: "id",
  startAt: 1
});

module.exports = mongoose.model("comment", CommentSchema);
