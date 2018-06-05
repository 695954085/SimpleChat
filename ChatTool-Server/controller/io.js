const Client = require('./client');
const socketDb = require('../model/socketdb')
function IoContoller(io) {
  // 使用默认的namespace, 默认进入大厅
  io.on('connection', function (socket) {
    console.log('a user connected');
    var client = new Client(socket, socketDb);
  });
}

module.exports = function (io) {
  return IoContoller(io);
}