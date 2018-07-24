// 用户管理房间的client
class Room {

  constructor(roomId) {
    this.roomId = roomId // 房间id
    this.clients = new Array() // 房间里面的client数量
  }

  // 管理房间的socket
  joinRoom(client) {
    this.clients.push(client)
  }

  leaveRoom(client) {

  }

  // 获取房间的房间号
  getRoomId() {
    return this.roomId
  }

  /**
   * 返回房间的所有client对象
   */
  getRoomClients() {
    return this.clients
  }

  /**
   * 返回房间的client数量
   */
  getRoomClientCount() {
    return this.clients.length
  }
}

export default Room