import chalk from 'chalk'
import Dialog from '../model/dialog'
import util from 'util'

/**
 * 此类是user和socket结合类
 */
class Client {

  /**
   * 
   * @param {SocketIO.Socket} socket 
   * @param {*} socketDb 
   * @param {SocketIO.Server} io 
   */
  constructor(socket, socketDb, io) {
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
    this.deleteRoom = this.deleteRoom.bind(this)
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
    // 设置离开/删除房间(非正常离线，用户主动删除房间)
    this.socket.on('deleteRoom', this.deleteRoom)
  }

  /**
   * 用户删除房间
   */
  async deleteRoom(roomId, callback) {
    try {
      if (this.user == null)
        throw `${this.socket.id}尚未登录，不能删除${roomId}房间`
      if (this.rooms.indexOf(roomId) == -1)
        throw `${this.user.username}不存在该${roomId}房间`
      this.rooms.splice(this.rooms.indexOf(roomId), 1)
      let room = this.socketDb.getRoom(roomId)
      if (room == null)
        throw `${roomId}房间不存在`
      // 1. room删除client对象
      room.leaveRoom(this)
      // 2. 数据库dialog userList删除user
      // Dialog.updateOne({ roomId: roomId }, { $pull: { userList: this.user.username } }, (err, dialog) => {
      //   if (err) {
      //     console.log(chalk.red(err))
      //     return
      //   }
      //   console.log(chalk.green(dialog))
      // })
      let query = Dialog.updateOne({ roomId: roomId }, { $pull: { userList: this.user.username } })
      let dialog = await query.exec()
      console.log(chalk.green(dialog))
      // 2.2 socket离开房间
      this.socket.leave(roomId)
      // 3. 推送房间在线人数
      this._sendOnlineMessage(roomId)

      callback({
        error: -1,
        message: `${roomId}房間userList成功刪除${this.user.username}`
      })
    } catch (err) {
      callback({
        error: 0,
        message: err
      })
    }
  }

  /**
   * 离线监听器
   */
  disconnect(reason) {
    try {
      console.log(chalk.red(reason))
      console.log(chalk.red(`${this.socket.id} 离线`));
      this.socket.leaveAll()
      // 1. client所添加的room都离开
      // 2. 如果room没有用户了，就删除
      // 3. 通知所有用户
      this.rooms.forEach(roomId => {
        this._sendOnlineMessage(roomId)
      })
      this.socketDb.removeClient(this)
    } catch (err) {
      console.log(chalk.red(err))
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
  async createRoom(newRoomId, callback) {
    try {
      // 判斷是否已經登錄
      if (this.user === null) {
        callback({
          message: '該用戶尚未登錄',
          error: 0
        })
        return;
      }
      // 如果socket在该房间已经存在，那么就不用再创建或者加入了
      if (this.rooms.indexOf(newRoomId) === -1) {
        // 創建房間
        this.socket.join(newRoomId, async err => {
          if (err) {
            console.log(chalk.red(`socket无法加入${newRoomId}`))
            return
          }
          console.log(chalk.green(`${this.socket.id}成功加入${newRoomId}`))
          // 成功創建房間/加入房间
          this.rooms.push(newRoomId)
          await this.socketDb.createRoom(newRoomId, this)

          // 向房间全部人推送在线人数的变化
          this._sendOnlineMessage(newRoomId)
          callback({
            message: `成功创建/加入${newRoomId}房间`,
            error: -1
          })
        })
      }
    } catch (err) {
      console.log(chalk.red(err))
    }
  }

  _sendOnlineMessage(roomId) {
    try {
      // 向房间全部人推送在线人数的变化
      // let onlineSocketIds = Object.keys(this.io.to(roomId).sockets)
      // let onlineClients = onlineSocketIds.filter(socketId => {
      //   let client = this.socketDb.getClient(socketId)
      //   return client.user === null ? false : true
      // }).map(socketId => {
      //   let client = this.socketDb.getClient(socketId)
      //   return {
      //     sid: socketId,
      //     username: client.user.username
      //   }
      // })
      let onlineClients = this.socketDb.getRoom(roomId).clients.map(client => {
        return {
          sid: client.socket.id,
          username: client.user.username
        }
      })
      this.io.to(roomId).emit('online', {
        roomId: roomId,
        onlineClients: onlineClients
      })
    } catch (err) {
      console.log(chalk.red(err))
    }
  }

  sendMessage(message, callback) {
    try {
      if (this.user === null && callback) {
        callback({
          message: '該用戶尚未登錄',
          error: 0
        })
        return
      }
      let type = message.type;
      switch (type) {
        case 'privateMessage':
        case 'roomMessage':
          this._sendRoomAndProvateMessage(message, callback)
          break;
        case 'hallMessage':
        default:
          this._sendHallMessage(message, callback)
      }
    } catch (err) {
      console.log(chalk.red(err))
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
      let { roomId, value } = message
      if (!roomId || !value) {
        console.log(chalk.red('roomId 和 value 不能为空'))
        callback({
          message: 'roomId 和 value 不能为空',
          code: 0
        })
        return
      }
      // this.socket.to(roomId).emit('RoomAndPrivateMessage', function (data, fn) {
      //   // 客户端收到消息时候回调
      //   // acknowledgements are not supported when emitting from namespace.
      //   // acknowledgements are not supported when broadcasting.
      // });
      this.socket.to(roomId).emit('RoomAndPrivateMessage', message)
      callback({
        message: `${this.user.username} 發送到${roomId}房間的消息，成功發送`,
        error: -1
      })

      // MongoDB操作
      // 1. 通过roomId找到dialog实例
      Dialog.findOne({ roomId: roomId }, (err, res) => {
        if (err) {
          console.log(chalk.red('数据库操作异常'))
          return
        }
        if (res == null) {
          console.log(chalk.red(`${roomId}数据在dialog中不存在`))
          return
        }
        // 2. 插入操作
        if (res.conversation == null) {
          let array = new Array()
          res.conversation = array
        }
        res.conversation.push({
          content: value,
          date: new Date(),
          username: this.user.username,
          contentType: 'string'
        })
        res.save((err, dialog) => {
          if (err) {
            console.log(chalk.red(`dialog数据库操作失败, ${err}`))
            return
          }
          console.log(chalk.green(`dialog数据库操作成功, ${dialog}`))
        })
      })
    } catch (err) {
      console.log(chalk.red(`${this.user.username} 發送到${roomId}房間的消息，发送失败` + err))
      callback({
        message: `${this.user.username} 發送到${this.roomId}房間的消息，发送失败`,
        error: 0
      })
    }
  }

  setUser(user) {
    this.user = user
    console.log(chalk.green(`${this.socket.id}成功绑定${this.user.username}`))
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