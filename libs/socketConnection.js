require("./removeByValue")();

module.exports = function(io) {
  var userList = [];

  io.on("connection", function(socket) {
    var session = socket.request.session.passport;
    var user = typeof session !== "undefined" ? session.user : "";

    // userList 필드에 사용자 명이 존재 하지 않으면 삽입
    if (userList.indexOf(user.displayname) === -1) {
      userList.push(user.displayname);
    }

    io.emit("join", userList);

    socket.on("disconnect", function() {
      userList.removeByValue(user.displayname);
      io.emit("leave", userList);
    });

    socket.on("chat message", function(data) {
      io.emit("toClient", {
        message: data.message,
        displayname: user.displayname
      });
    });
  });
};
