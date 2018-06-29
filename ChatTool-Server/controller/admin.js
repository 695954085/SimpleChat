const util = require('util');
const User = require('../model/user');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const path = require('path');
const fs = require('fs')
const formidable = require('formidable')
const myEmiter = require('./myeventemitter')

function Admin() {
    // this.register = Admin.prototype.register.bind(this);
    // this.login = Admin.prototype.login.bind(this);
}

Admin.prototype.login = function (req, res, next) {
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
                user.save(function (err, result) {
                    if (err) {
                        next(createError(err));
                        return;
                    }
                    var content = {
                        username: user.username,
                        avatar: user.avatar,
                        id: user._id,
                        token: token
                    }
                    res.send(content);
                    // 登录成功 可以创建Client了
                    myEmiter.emit('login_success', result)
                })
            })
        })
    })
}

// 用户注册
Admin.prototype.register = function (req, res, next) {
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

// 用户退出登录
Admin.prototype.signOut = function (req, res, next) {
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

Admin.prototype.uploadAvatar = function (req, res, next) {
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
        // fs.rename(files['avatar'].path, path.join(__dirname, '../public/',`${username}_avatar.${extension}`), function (err) {
        //   if(err){
        //     next(err);
        //     return;
        //   }
        //   res.send({
        //     message:'头像成功上传'
        //   })
        // })
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

Admin.prototype.user = function (req, res, next) {
    User.find((err, users) => {
        if (err) {
            next(createError(500, '数据库异常'))
            return
        }
        res.send(users)
    })
}
module.exports = new Admin();