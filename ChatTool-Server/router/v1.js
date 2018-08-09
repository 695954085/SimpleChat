import express from 'express'
import bodyParser from 'body-parser'
import admin from '../controller/admin'
import passport from 'passport'
import socketDb from '../controller/socketdb'
import createError from 'http-errors'
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();
var passportMiddle = function (req, res, next) {
	passport.authenticate('bearer', { session: false }, function (err, user, info) {
		if (user === false)
			return next(createError(401, '没有token'))
		let { sid } = req.body
		if (err && err.name === 'TokenExpiredError') { // token超时
			let client = socketDb.getClient(sid)
			if (client) {
				client.user = null
			}
		}
		if (err) {
			return next(createError(401, err.message))
		}
		return next()
	})(req, res, next)
}
//获取用户列表数据
router.get('/user', urlencodedParser, passportMiddle, admin.user);
//注册某一个用户
router.post('/user', urlencodedParser, admin.register)
//修改用户数据
router.put('/user', urlencodedParser, passportMiddle, function (req, res, next) {

});
//删除用户数据
router.delete('/user', urlencodedParser, passportMiddle, function (req, res, next) {

});
//用户登录
router.post('/login', urlencodedParser, admin.login);
//用户登出
router.post('/signout', urlencodedParser, admin.signOut);
//上傳頭像
router.post('/avatar', urlencodedParser, passportMiddle, admin.uploadAvatar);

export default router

