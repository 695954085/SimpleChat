const Client = require('./client');

function IoContoller(io) {
  var clients = new Array();
  // 使用默认的namespace
  io.on('connection', function (socket) {
    console.log('a user connected');
    // socket.on('disconnect', function () {
    //   console.log('user disconnected');
    // });
    var client = new Client(socket);
    clients.push(client);
  });
}

module.exports = function (io) {
  return IoContoller(io);
}