import Dialog from '../model/dialog'
import chalk from '../node_modules/chalk';
// 用户管理房间的client
class Room {

  constructor(roomId, ownerUserName) {
    this.roomId = roomId // 房间id
    this.ownerUserName = ownerUserName // 群主userName
    this.clients = new Array() // 房间里面的client数量
    this.init() //初始化
  }

  init() {
    let dialog = new Dialog({
      roomId: this.roomId,
      owner: this.ownerUserName
    })
    dialog.save((err) => {
      if (err) {
        chalk.red(`${this.roomId} 房间创建失败`)
      }
    })
  }

  // 管理房间的socket
  joinRoom(client) {
    // 如果client不存在才添加
    if (this.clients.indexOf(client) === -1) {
      this.clients.push(client)
    }
  }

  leaveRoom(client) {
    let index = this.clients.indexOf(client)
    // client存在
    if (index !== -1) {
      this.clients.splice(index, 1)
      // 删除成功
      return true
    }
    return false
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