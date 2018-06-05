const EventEmitter = require('events');
const _ = require('lodash');

class Client extends EventEmitter {

  constructor(socket, socketDb) {
    super();
    this.socket = socket;
    this.socketDb = socketDb;
    this.roomId = '';
    this.init();
  }

  init() {
    this.socketDb.addClient();
    this.socketDb.addHall();
    this.socket.on('createRoom', data => {
      this.createRoom(data);
    });
    this.socket.on('message', data => {
      console.log(data);
      // this.sendMessage(data);
    })
  }

  createRoom(newRoomId) {
    this.socket.join(newRoomId, err => {
      if (err) {
        console.log(`socket无法加入${newRoomId}`);
        return;
      }
      this.socketDb.joinRoom(newRoomId, this.socket);
      if (!_.isEmpty(this.roomId)) {
        this.socket.leave(this.roomId);
        console.log(`socket已经离开${this.roomId}`)
        this.socketDb.leaveRoom(this.roomId, this.socket);
      }
      this.roomId = newRoomId;
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