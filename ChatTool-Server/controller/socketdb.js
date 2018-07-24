import Room from './room'
import Client from './client'

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
    this.rooms = new Array()
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
  }

  /**
   * 創建房間
   * @param {string} roomId 
   */
  createRoom(roomId) {
    let room = new Room(roomId)
    this.rooms.push(room)
  }

  /**
   * 创建Client对象
   * @param {SocketIO.Socket} socket 
   */
  createClient(socket) {
    let client = new Client(socket, this, this.io);
    this.addClient(client)
  }

  /**
   * 返回client对象
   * @param {string} sid 
   */
  getClient(sid) {
    this.clients.forEach((value, index) => {
      if (value.getSocketId() === sid) {
        return value
      }
    })
  }
}

export default new SocketDB()
