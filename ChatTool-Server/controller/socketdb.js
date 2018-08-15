import Room from './room'
import Client from './client'
import chalk from '../node_modules/chalk';
import { Request, Response } from 'express'
import Dialog from '../model/dialog'
import assert from 'assert'
import createError from 'http-errors'

class SocketDB {

	constructor() {
    /**
     * 终极io对象，底层用于通信
     */
		this.io = null
    /**
     * 所有的client
     */
		this.clients = new Array()
    /**
     * 所有房间
     */
		this.rooms = new Map()

		this.getRoomDialog = this.getRoomDialog.bind(this)
		this.getRoomOnlineClients = this.getRoomOnlineClients.bind(this)
	}

	setIO(io) {
		this.io = io
	}

	isExitsRoom(roomId) {
		return this.rooms.get(roomId) ? true : false
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
				while (clientRooomIds.length > 0) {
					let roomId = clientRooomIds.pop()
					let room = this.rooms.get(roomId)
					room.leaveRoom(client)
					if (room.getRoomClientCount() === 0) {
						this.rooms.delete(roomId)
					}
				}
			}
			console.log(chalk.red(`${client.socket.id} 删除成功`))
		} else {
			console.log(chalk.red(`${client.socket.id} 已经不存在`))
		}
	}

  /**
   *  client退出登录
   * @param {*} client
   */
	logout(client) {
		let index = this.clients.indexOf(client)
		if (index !== -1) {
			// 删除房间中的client
			client.logout(`${client.user.username}客户端主动退出登录`)
		}
		console.log(chalk.red(`${client.socket.id} 删除成功`))
	}

  /**
   * 創建房間/加入房间
   * @param {string} roomId
   */
	async createRoom(roomId, client) {
		// 判断这个room是否已经存在。 如果存在就加入房间，没有就创建房间并加入
		if (!this.isExitsRoom(roomId)) {
			let room = new Room(roomId, client.user.username)
			await room.init()
			this.rooms.set(roomId, room)
			await room.joinRoom(client)
		} else {
			let room = this.rooms.get(roomId)
			await room.joinRoom(client)
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
			console.log(chalk.red(`${socket.sid} 已存在`));
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
			console.log(chalk.red(err))
			return null
		}
	}

  /**
   * 通过username返回client对象
   * @param {string} username
   */
	getClientByUserName(username) {
		try {
			for (var client of this.clients) {
				if (client.user && client.user.username === username) {
					return client
				}
			}
			return null
		} catch (err) {
			console.log(chalk.red(err))
			return null
		}
	}

  /**
   * 获取某个房间数据
   * @param {Request} req
   * @param {Response} res
   */
	async getRoomDialog(req, res) {
		try {
			let roomId = req.params.roomId
			if (!roomId)
				throw "roomId不能为空"
			let start = req.query.start
			let end = req.query.end
			if (!start || !end)
				throw 'start或end不能为空'
			let query = Dialog.find({ roomId: roomId })
			query = query.slice('conversation', [parseInt(start), parseInt(end)])
			let conversations = await query.exec()
			res.json(conversations)
		} catch (err) {
			console.log(chalk.red(err))
			res.send({
				message: err,
				error: 0
			})
		}
	}

  /**
   * 获取指定房间的在线用户
   * @param {Request} req
   * @param {Response} res
   */
	getRoomOnlineClients(req, res) {
		try {
			let roomId = req.params.roomId
			if (!roomId)
				throw 'roomId不能为空'
			let room = this.getRoom(roomId)
			if (!room)
				throw `${roomId}房间不存在`
			let clients = room.getRoomClients()
			let onlineClients = clients.map(client => {
				return {
					sid: client.socket.id,
					username: client.user.username
				}
			})
			res.send({
				roomId: roomId,
				onlineClients: onlineClients
			})
		} catch (err) {
			console.log(chalk.red(err))
			res.send({
				message: err,
				error: 0
			})
		}
	}

  /**
   * 獲取某個用戶擁有的房間號
   * @param {Request} req
   * @param {Response} res
   */
	async getUserRooms(req, res) {
		try {
			let username = req.params.username
			let query = Dialog.find({ userList: username }, { roomId: 1, owner: 1 })
			let result = await query.exec()
			res.send({
				username,
				rooms: result
			})
		} catch (err) {
			console.log(chalk.red(err))
			res.send({
				message: err,
				error: 0
			})
		}
	}

	getRoom(roomId) {
		return this.rooms.get(roomId)
	}

	/**
	 * 获取某个房间的详情
	 * @param {Request} req
	 * @param {Response} res
	 * @param {*} next
	 */
	async getRoomDetails(req, res, next) {
		try {
			let roomId = req.params.roomId
			assert.ok(roomId, 'roomId不存在')
			let query = Dialog.findOne({ roomId }, '-conversation')
			let value = await query.exec()
			res.send(value)
		} catch (err) {
			next(createError(400, err))
		}
	}
}

export default new SocketDB()
