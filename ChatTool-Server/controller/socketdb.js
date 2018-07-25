import Room from './room'
import Client from './client'
import chalk from '../node_modules/chalk';

class SocketDB {

  constructor(io) {
    /**
     * 终极io对象，底层用于通信
     */
    this.io = io
    /**
     * 所有的client
     */
    this.clients = new Array()
    /**
     * 所有房间
     */
    this.rooms = new Map()
  }

  // 获取房间所有房间id
  getRoomIds() {
    return Object.keys(this.rooms)
  }

  // 添加client对象
  addClient(client) {
    this.clients.push(client)
  }

  /**
   * 删除disconnect的Client
   * @param {Client} client 
   */
  removeClient(client) {
    // 1. 删除Room中的Client
    // 2. 删除totalClient中的client
    let index = this.clients.indexOf(client)
    if (index !== -1) {
      this.clients.splice(index, 1)
      // 删除房间中的client
      let clientRooomIds = client.getRooms()
      if (clientRooomIds.length > 0) {
        clientRooomIds.forEach((roomId, index) => {
          let room = this.rooms.get(roomId)
          room.leaveRoom(client)
          if (room.getRoomClientCount() === 0) {
            this.rooms.delete(roomId)
          }
        })
      }
      chalk.red(`${client.socket.id} 删除成功`)
    } else {
      chalk.red(`${client.socket.id} 已经不存在`)
    }
  }

  /**
   * 創建房間/加入房间
   * @param {string} roomId 
   */
  createRoom(roomId, client) {
    // 判断这个room是否已经存在。 如果存在就加入房间，没有就创建房间并加入  
    if (this.getRoomIds().indexOf(roomId) === -1) {
      let room = new Room(roomId)
      this.rooms.set(roomId, room)
      room.joinRoom(client)
    } else {
      let room = this.rooms.get(roomId)
      room.joinRoom(client)
    }
  }

  /**
   * 创建Client对象
   * @param {SocketIO.Socket} socket 
   */
  createClient(socket) {
    if (this.getClient(socket.id) === null) {
      let client = new Client(socket, this, this.io);
      this.addClient(client)
    } else {
      chalk.red(`${socket.sid} 已存在`)
    }
  }

  /**
   * 返回client对象
   * @param {string} sid 
   */
  getClient(sid) {
    try {
      for (var client of this.clients) {
        if (client.getSocketId() === sid) {
          return client
        }
      }
      return null
    } catch (err) {
      chalk.red(err)
      return null
    }
  }
}

export default new SocketDB()
