import express from 'express'
import bodyParser from 'body-parser'
import admin from '../controller/admin'
import passport from 'passport'
import socketDb from '../controller/socketdb'
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();

//获取用户列表数据
router.get('/user', passport.authenticate('bearer', {
  session: false
}, function (err, user, info) {
  if (err) {
    // token过时或者异常
    // 重新登录 ， 将client对象的user切开
    let { username } = user
    if (username) {
      let client = socketDb.getClientByUserName(username)
      if (client) {
        client.user = null
      }
    }
  }
}), admin.user);
//注册某一个用户
router.post('/user', urlencodedParser, admin.register)
//修改用户数据
router.put('/user', passport.authenticate('bearer', {
  session: false
}, function (err, user, info) {
  if (err) {
    // token过时或者异常
    // 重新登录 ， 将client对象的user切开
    let { username } = user
    if (username) {
      let client = socketDb.getClientByUserName(username)
      if (client) {
        client.user = null
      }
    }
  }
}), function (req, res, next) {

});
//删除用户数据
router.delete('/user', passport.authenticate('bearer', { session: false }), function (req, res, next) {

});
//用户登录
router.post('/login', urlencodedParser, admin.login);
//用户登出
router.post('/signout', urlencodedParser, admin.signOut);
//上傳頭像
router.post('/avatar', passport.authenticate('bearer', { session: false }), admin.uploadAvatar);

export default router

