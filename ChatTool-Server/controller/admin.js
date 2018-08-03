import User from '../model/user'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import config from 'config'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import formidable from 'formidable'
import socketDb from './socketdb'
import chalk from '../node_modules/chalk';
import { Request, Response } from 'express'

class Admin {

    constructor() {
    }

    login(req, res, next) {
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

    uploadAvatar(req, res, next) {
        var form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname, '../public/avatar/tmp');
        form.keepExtensions = true;
        form.type = 'multipart';
        form.parse(req, function (err, fields, files) {
            if (err) {
                next(err);
                return;
            }
            var { username } = fields;
            var extension = files['avatar'].name.split('.')[files['avatar'].name.split('.').length - 1] || 'jpg';
            var readStream = fs.createReadStream(files['avatar'].path);
            readStream.on('close', function () {
                fs.unlink(files['avatar'].path, function (err) {
                    if (err) {
                        next(err);
                        return;
                    }
                    res.send({
                        message: '头像成功上传'
                    })
                })
            })
            var writeStream = fs.createWriteStream(path.join(__dirname, '../public/', `${username}_avatar.${extension}`));
            readStream.pipe(writeStream);
        });
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