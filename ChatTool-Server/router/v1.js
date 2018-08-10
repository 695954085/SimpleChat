import express from 'express'
import bodyParser from 'body-parser'
import admin from '../controller/admin'
import passportMiddle from '../middle/passportMiddle'

let urlencodedParser = bodyParser.urlencoded({ extended: false })
let router = express.Router();

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

