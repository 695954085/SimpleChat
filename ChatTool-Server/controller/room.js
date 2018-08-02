import Dialog from '../model/dialog'
import chalk from '../node_modules/chalk';
import Client from './client';
// 用户管理房间的client
class Room {

  constructor(roomId, ownerUserName) {
    this.roomId = roomId // 房间id
    this.ownerUserName = ownerUserName // 群主userName
    this.clients = new Array() // 房间里面的client数量
  }

  async init() {
    try {
      // 首先判断是否已经存在该表
      // Dialog.findOne({ roomId: this.roomId }).then(value => {
      //   if (value !== null) {
      //     console.log(chalk.green(`${this.roomId} collection 已经在`))
      //     throw `${this.roomId}的dialog已存在`
      //   }
      //   let dialog = new Dialog({
      //     roomId: this.roomId,
      //     owner: this.ownerUserName
      //   })
      //   return dialog.save()
      // }, reason => {
      //   console.log(chalk.red('Dialog.findOne异常'))
      //   console.log(chalk.red(reason))
      // }).then(value => {
      //   console.log(chalk.green(`${this.roomId}房间数据集合创建成功`))
      // }, reason => {
      //   console.log(chalk.red(reason))
      // })
      let query = Dialog.findOne({ roomId: this.roomId })
      let dialog = await query.exec()
      if (dialog != null) {
        console.log(chalk.green(`${this.roomId} collection 已经在`))
        throw `${this.roomId}的dialog已存在`
      }
      dialog = new Dialog({
        roomId: this.roomId,
        owner: this.ownerUserName
      })
      await dialog.save()
      console.log(chalk.green(`${this.roomId}房间数据集合创建成功`))
    } catch (err) {
      console.log(chalk.red('dialog collection操作失败'))
      console.log(chalk.red(err))
    }
  }

  /**
   * 加入房间
   * @param {Client} client 
   */
  async joinRoom(client) {
    // 如果client不存在才添加
    try {
      if (this.clients.indexOf(client) === -1) {
        this.clients.push(client)
        if (client.user == null) {
          console.log(chalk.red(`${client}的user不能为空`))
        }
        // 用户名信息放进去dialog里面
        // Dialog.findOne({ roomId: this.roomId }).then(room => {
        //   if (room == null) {
        //     return Promise.reject(`${this.roomId}房间在dialog中为空`)
        //   }
        //   let { userList } = room
        //   if (userList == null) {
        //     room.userList = new Array()
        //   }
        //   room.userList.push(client.user.username)
        //   return room.save()
        // }, err => {
        //   console.log(chalk.red(err))
        // }).then(() => {
        //   console.log(chalk.green(`${client.user.username}成功插入${this.roomId}的userList`))
        // }, reason => {
        //   console.log(chalk.red(reason))
        // })
        let query = Dialog.findOne({ roomId: this.roomId })
        let room = await query.exec()
        if (room == null) {
          return `${this.roomId}房间在dialog中为空`
        }
        let { userList } = room
        if (userList == null) {
          room.userList = new Array()
        }
        if(room.userList.indexOf(client.user.username) === -1)
          room.userList.push(client.user.username)
        await room.save()
        console.log(chalk.green(`${client.user.username}成功插入${this.roomId}的userList`))
      }
    } catch (err) {
      console.log(chalk.red(err))
    }
  }

  /**
   * 离开房间(只是离线状态)
   * @param {Client} client 
   */
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

  contains(client) {
    return this.clients.indexOf(client) === -1 ? false : true
  }
}

export default Room