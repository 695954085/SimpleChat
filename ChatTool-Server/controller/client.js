const EventEmitter = require('events');

class Client extends EventEmitter {

  constructor() {
    super();
  }

  createRoom(){
    
  }
}
// function Client(socket) {
//   this.socket = socket;
// }

// Client.prototype = new 

// Client.prototype.createRoom = function () {

// }

// Client.prototype.joinRoom = function () {

// }

// Client.prototype.leaveRoom = function () {

// }

// Client.prototype.sayToRoomMate = function(){

// }

module.exports = Client;