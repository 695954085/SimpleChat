import EventEmitter from 'events'
import chalk from 'chalk'
import Dialog from '../model/dialog'

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
    // client拥有的房间
    this.rooms = new Array()
    this.sendMessage = this.sendMessage.bind(this)
    this.createRoom = this.createRoom.bind(this)
    this.error = this.error.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.init()
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
    try {
      chalk.red(reason)
      chalk.red(`${this.socket} 离线`)
      // 1. 把所有对象remove掉
      // 2. 所有添加的所有房间
      this.socketDb.removeClient(this)
    } catch (err) {

    }
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
  createRoom(newRoomId, callback) {
    try {
      // 判斷是否已經登錄
      if (this.user === null) {
        callback({
          message: '該用戶尚未登錄',
          errorCode: 0
        })
        return;
      }
      // 如果socket在该房间已经存在，那么就不用再创建或者加入了
      if (this.rooms.indexOf(newRoomId) === -1) {
        // 創建房間
        this.socket.join(newRoomId, err => {
          if (err) {
            chalk.red(`socket无法加入${newRoomId}`)
            return
          }
          chalk.green(`${this.socket.id}成功加入${this.newRoomId}`)
          // 成功創建房間/加入房间
          this.rooms.push(newRoomId)
          this.socketDb.createRoom(newRoomId, this)

          callback({
            message: `成功创建/加入${newRoomId}房间`,
            error: -1
          })
        })
      }
    } catch (err) {
      chalk.red(err)
    }
  }

  sendMessage(message, callback) {
    if (this.user === null && callback) {
      callback({
        message: '該用戶尚未登錄',
        errorCode: 0
      })
      return
    }
    var type = message.type;
    switch (type) {
      case 'privateMessage':
      case 'roomMessage':
        this._sendRoomAndProvateMessage(message, callback)
        break;
      case 'hallMessage':
      default:
        this._sendHallMessage(message, callback)
    }
  }

  /**
   * 發送大廳消息
   * @param {Object} message 
   */
  _sendHallMessage(message) {
    // everyone gets it but the sender
    this.socket.broadcast.emit('HallMessage', message)
  }

  _sendRoomAndProvateMessage(message, callback) {
    try {
      let { rooomId, value } = message
      if (!rooomId || !value) {
        chalk.red('roomId 和 value 不能为空')
        return
      }
      // this.socket.to(rooomId).emit('RoomAndPrivateMessage', function (data, fn) {
      //   // 客户端收到消息时候回调
      //   // acknowledgements are not supported when emitting from namespace.
      //   // acknowledgements are not supported when broadcasting.
      // });
      this.socket.to(rooomId).emit('RoomAndPrivateMessage', message)
      callback({
        message: `${this.user.username} 發送到${this.rooomId}房間的消息，成功發送`,
        error: -1
      })
    } catch (err) {
      chalk.red(`${this.user.username} 發送到${this.rooomId}房間的消息，发送失败` + err)
      callback({
        message: `${this.user.username} 發送到${this.rooomId}房間的消息，发送失败`,
        error: 0
      })
    }
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