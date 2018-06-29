const EventEmitter = require('events');
const _ = require('lodash');

class Client extends EventEmitter {

  constructor(socket, socketDb, io, user) {
    super()
    this.socket = socket
    this.socketDb = socketDb
    this.roomId = ''
    this.io = io
    this.user = user
    console.log(user)
    this.init();
  }

  init() {
    this.socketDb.addClient();
    let that = this;
    // 默认加入大厅
    this.socketDb.addHall(function () {
      // 添加成功后，通知大厅里面的其他成员，有新成员加入了
      that.io.emit('announcement__hall',`欢迎新成员${that.socket.id}加入大厅`)
    });
    // 自定义创建房间
    this.socket.on('createRoom', data => {
      this.createRoom(data);
    });
    // 接收信息
    this.socket.on('message', this.sendMessage)
  }

  createRoom(newRoomId) {
    this.socket.join(newRoomId, err => {
      if (err) {
        console.log(`socket无法加入${newRoomId}`);
        return;
      }
      let that = this;
      this.socketDb.joinRoom(newRoomId, this.socket, function(arr) {
        // 可以利用arr，告知在线人数等信息
        that.io.to(newRoomId).emit('announcement__room',`欢迎新成员${that.socket.id}加入房间${newRoomId}`)
        that.io.to(newRoomId).emit('announcement__room',`当前房间人数:${arr.length}`)
      });
    })
  }

  sendMessage(message) {
    var type = message.type;
    switch (type) {
      case 'broadcast':
        break;
      case 'hall':
        break;
      case 'broadcast-all':
        break;
    }
  }
}

module.exports = Client;
