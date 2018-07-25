import EventEmitter from 'events'
import chalk from 'chalk'

/**
 * 此类是user和socket结合类
 */
class Client extends EventEmitter {

  /**
   * 
   * @param {SocketIO.Socket} socket 
   * @param {*} socketDb 
   * @param {SocketIO.Server} io 
   */
  constructor(socket, socketDb, io) {
    super()
    this.socket = socket
    this.socketDb = socketDb
    this.io = io
    this.user = null
    this.init()
    // client拥有的房间
    this.rooms = new Array()
  }

  /**
   *  初始化方法
   */
  init() {
    // 设置服务器接受消息监听器
    this.socket.on('message', this.sendMessage)
    // 设置创建房间监听器
    this.socket.on('createRoom', this.createRoom)
    // 设置离线监听器
    this.socket.on('disconnect', this.disconnect)
    // 设置错误监听器
    this.socket.on('error', this.error)
  }

  /**
   * 离线监听器
   */
  disconnect(reason) {
    chalk.red(reason)
    chalk.red(`${this.socket.id} 离线`)
    // 1. 把所有对象remove掉
    // 2. 所有添加的所有房间
    this.socketDb.removeClient(this)
  }

  /**
   * 错误监听器
   * @param {*} error 
   */
  error(error) {
    this.socket.emit('error', error)
  }

  /**
   * 创建房间/加入房间
   * @param {string} newRoomId 
   */
  createRoom(newRoomId) {
    try {
      // 如果socket在该房间已经存在，那么就不用再创建或者加入了
      if (this.rooms.indexOf(newRoomId) === -1) {
        // 創建房間
        this.socket.join(newRoomId, err => {
          if (err) {
            chalk.red(`socket无法加入${newRoomId}`)
            return
          }
          // 成功創建房間/加入房间
          this.rooms.push(newRoomId)
          this.socketDb.createRoom(newRoomId)
        })
      }
    } catch (err) {
      chalk.red(err)
    }
  }

  sendMessage(message) {
    var type = message.type;
    switch (type) {
      case 'privateMessage':
      case 'roomMessage':
        this._sendRoomAndProvateMessage(message)
        break;
      case 'hallMessage':
      default:
        this._sendHallMessage(message)
    }
  }

  /**
   * 發送大廳消息
   * @param {Object} message 
   */
  _sendHallMessage(message) {

  }

  _sendRoomAndProvateMessage(message) {
    let { rooomId, value } = message
    if (!rooomId || !value) {
      chalk.red('roomId 和 value 不能为空')
      return
    }
    this.socket.to(rooomId).emit('RoomAndPrivateMessage', value);
  }

  setUser(user) {
    this.user = user
  }

  getSocketId() {
    return this.socket.id
  }

  /**
   * 返回所拥有的房间id
   */
  getRooms() {
    return this.rooms
  }
}

export default Client;