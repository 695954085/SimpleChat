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
class Admin {

	constructor() {
		this.uploadAvatar = this.uploadAvatar.bind(this)
	}

	login(req, res, next) {
		var form = req.body;
		if (_.isEmpty(form)) {
			next(createError(500, '入参不能为空'))
			return
		}
		aasdUser.findOne({ username: form.username }, (err, user) => {
			if (err) {
				next(createError(500, err.msg));
				return;
			}
			if (!user) {
				next(createError(500, "没有该用户"));
				return;
			}
			user.comparePassword(form.password, function (err, isMatch) {
				if (err) {
					next(err);
					return;
				}
				if (!isMatch) {
					// 密码不正确
					next(createError(400, "密码不正确"));
					return;
				}
				// 生成token
				jwt.sign({ username: user.username }, config.get("Customer.jwtSecret"), {
					expiresIn: '1h'
				}, function (err, token) {
					if (err) {
						next(createError(err));
						return;
					}
					user.token = token;
					user.save(function (err) {
						if (err) {
							next(createError(err));
							return;
						}
						var content = {
							username: user.username,
							avatar: user.avatar,
							id: user._id
						}
						// 关联admin与client
						try {
							socketDb.getClient(form.sid).setUser(content)
							res.send(Object.assign(content, { token: token }));
						} catch (err) {
							console.log(chalk.red(err))
							next(createError(err))
						}
					})
				})
			})
		})
	}

	register(req, res, next) {
		var form = req.body;
		if (_.isEmpty(form)) {
			next(createError(500, '入参不能为空'))
			return
		}
		User.findOne({ username: form.username }, (err, user) => {
			if (err) {
				next(createError(500, err.msg));
				return;
			}
			if (user) {
				// 该用户已存在
				next(createError(400, "该用户已存在"));
				return;
			}
			var user = new User({
				username: form.username,
				password: form.password,
				date: new Date()
			});
			user.save(function (err, doc) {
				if (err) {
					next(createError(500, err.msg));
					return;
				}
				if (doc) {
					res.send({
						id: user._id
					});
				}
			});
		});
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
			form.parse(req, (err, fields, files) => {
				try {
					if (err) {
						next(err);
						return;
					}
					let { username } = fields;
					let extension = files['avatar'].name.split('.')[files['avatar'].name.split('.').length - 1] || 'jpg';
					let readStream = fs.createReadStream(files['avatar'].path);
					let writeStream = fs.createWriteStream(path.join(__dirname, '../public/', `${username}_avatar.${extension}`));
					readStream.pipe(writeStream);
					readStream.on('close', async () => {
						try {
							await fs.unlinkAsync(files['avatar'].path)
							res.send({
								message: '头像成功上传'
							})
						} catch (err) {
							next(err)
							return
						}
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
