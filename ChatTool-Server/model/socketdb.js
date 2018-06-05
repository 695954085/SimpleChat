const _ = require('lodash');

function SocketDB() {
  this.roomNumber = 0; // 房间数量
  this.totalClient = 0; // 总人数
  this.roomMateNumber = {}; // 各个房间人数
  this.hallClient = 0; //大厅人数
}

SocketDB.prototype.addClient = function () {
  this.totalClient++;
}

SocketDB.prototype.addHall = function () {
  this.hallClient++;
}

SocketDB.prototype.leaveHall = function () {
  this.hallClient--;
}

SocketDB.prototype.joinRoom = function (roomId, socket) {
  let arr;
  if (_.isNull(this.roomMateNumber[roomId])) {
    arr = new Array();
    arr.push(socket);
    this.roomMateNumber[roomId] = arr;
  } else {
    arr = this.roomMateNumber[roomId];
    arr.push(socket);
  }
}

SocketDB.prototype.leaveRoom = function (roomId, socket) {
  if (_.isNull(this.roomMateNumber[roomId])) {
    return;
  }
  var arr = this.roomMateNumber[roomId];
  _.remove(arr, function (n) {
    return n.id == socket.id
  })
}

module.exports = new SocketDB();

