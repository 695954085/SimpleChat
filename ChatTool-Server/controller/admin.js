import User from '../model/user'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import config from 'config'
import _ from 'lodash'
import path from 'path'
import fs, { stat, Stats } from 'fs'
import bluebird from 'bluebird'
import formidable from 'formidable'
import socketDb from './socketdb'
import chalk from '../node_modules/chalk';
import { Request, Response } from 'express'
bluebird.promisifyAll(fs)
bluebird.promisifyAll(jwt)
class Admin {

	constructor() {
		this.uploadAvatar = this.uploadAvatar.bind(this)
	}

	async login(req, res, next) {
		try {
			let form = req.body;
			if (_.isEmpty(form)) {
				next(createError(400, '入参不能为空'))
				return
			}
			let { username, sid, password } = form
			if (!username || !sid || !password) {
				next(createError(400, '缺少入参'))
				return
			}
			let query = User.findOne({ username })
			let user = await query.exec()
			if (!user) {
				next(createError(400, "没有该用户"));
				return
			}
			user.comparePassword(password, async (err, isMatch) => {
				if (err) {
					next(createError(400, err.message))
					return
				}
				if (!isMatch) {
					// 密码不正确
					next(createError(400, "密码不正确"));
					return;
				}
				// 生成token
				let token = await jwt.signAsync({ username }, config.get("Customer.jwtSecret"), { expiresIn: '1h' })
				user.token = token;
				user = await user.save()
				let content = {
					username,
					avatar: user.avatar || '/default.jpg',
					id: user._id
				}
				// 关联admin与client
				let client = socketDb.getClient(sid)
				if (client) {
					client.setUser(content)
					res.send(Object.assign(content, { token }));
				} else {
					next(createError(400, 'sid匹配不到client'))
				}
			})
		} catch (err) {
			next(err)
		}
	}

	async register(req, res, next) {
		try {
			let form = req.body;
			if (_.isEmpty(form)) {
				next(createError(400, '入参不能为空'))
				return
			}
			let { password, username } = form
			if (!username || !password) {
				next(createError(400, '缺少入参'))
				return
			}
			let query = User.findOne({ username })
			let user = await query.exec()
			if (user) {
				// 该用户已存在
				next(createError(400, "该用户已存在"));
				return;
			}
			user = new User({
				username,
				password,
				date: new Date(),
				avatar: '/default.jpg'
			});
			user = await user.save()
			res.send({
				id: user._id
			})
		} catch (err) {
			next(createError(500, err))
		}
	}

	signOut(req, res, next) {
		// 删除token？
		// 1. 如果登出也认证token，那么如果token已经过期了，那么就不能登出了
		var { username } = req.body;
		// 如果这个authorization不为空
		if (!_.isNil(req.headers['authorization'])) {
			var token = req.headers['authorization'].split(" ")[1];
			User.findOneAsync({ username: username }).then(doc => {
				if (_.isEqual(token, doc.token)) {
					// 如果相等，那么清除token
					doc.token = "";
					doc.saveAsync();

					// socketDb清除数据
					let client = socketDb.getClientByUserName(username)
					if (client) {
						socketDb.logout(client)
					}
				}
				res.send({
					message: "退出成功"
				})
				return;
			}).catch(rejection => {
				next(rejection);
				return;
			});
		} else {
			next(createError(500, '嘻嘻嘻，后续处理'));
		}
	}

	// 创建目录的条件时，父目录存在且子目录不存在
	async mkdirs(dirname) {
		// 1. 判断这个dir是否存在 如果存在，不再继续走
		// 2.  next() //回溯dirParent
		// 3. next()执行完 返回 断定之前的目录已经存在， 创建目录
		try {
			let stats = await fs.statAsync(dirname)
			return Promise.resolve('ok')
		} catch (err) {
			if (err.code === 'ENOENT') {
				let value = await this.mkdirs(path.dirname(dirname))
				if (value === 'ok')
					await this.mkdir(dirname)
				return Promise.resolve('ok')
			}
			return Promise.reject(err)
		}
	}

	// 创建目录
	async mkdir(path) {
		return fs.mkdirAsync(path)
	}

	async uploadAvatar(req, res, next) {
		try {
			let form = new formidable.IncomingForm();
			let imgDirectory = path.join(__dirname, '../public/avatar/tmp')
			await this.mkdirs(imgDirectory)
			form.uploadDir = imgDirectory;
			form.keepExtensions = true;
			form.type = 'multipart';
			form.parse(req, async (err, fields, files) => {
				try {
					if (err) {
						next(err);
						return;
					}
					let { username } = fields;
					let extName = path.extname(files['avatar'].name)
					await fs.rename(files['avatar'].path, path.join(__dirname, '../public', `${username}_avatar${extName}`))
					res.send({
						message: '头像上传成功',
						path: `/${username}_avatar${extName}`
					})
				} catch (err) {
					next(err)
					return
				}
			});
		} catch (err) {
			console.log(chalk.red(err))
			next(createError(500, '上传图片失败'))
		}
	}

	/**
	 * 返回用户信息
	 * @param {Request} req
	 * @param {Response} res
	 * @param {*} next
	 */
	user(req, res, next) {
		User.find((err, users) => {
			if (err) {
				next(createError(500, '数据库异常'))
				return
			}
			res.send(users)
		})
	}
}

export default new Admin()
