const Client = require('./client');
const socketDb = require('./socketdb')
const myEmitter = require('./myeventemitter')

function IoContoller(io) {
  // 使用默认的namespace, 默认进入大厅
  io.on('connection', function (socket) {
    console.log('a user connected');
    // 虽然已经与服务器建立连接，但是用户尚未登录，应该不创建Client
    myEmitter.on('login_success', function(result) {
      var client = new Client(socket, socketDb, io, result);
    })
  });
}

module.exports = function (io) {
  return IoContoller(io);
}