const util = require('util');
const User = require('../model/user');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const config = require('config');

function Admin() {
  this.register = Admin.prototype.register.bind(this);
  this.login = Admin.prototype.login.bind(this);
}

Admin.prototype.login = function (req, res, next) {
  var form = req.body;
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
        next(createError(500, "密码不正确"));
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
            id: user._id
          }
          res.send(content);
        })
      })
    })
  })
}

// 用户注册
Admin.prototype.register = function (req, res, next) {
  var form = req.body;
  User.findOne({ username: form.username }, (err, user) => {
    if (err) {
      next(createError(500, err.msg));
      return;
    }
    if (user) {
      // 该用户已存在
      next(createError(500, "该用户已存在"));
      return;
    }
    var user = new User({
      username: form.username,
      password: form.password
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

module.exports = new Admin();