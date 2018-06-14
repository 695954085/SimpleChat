const express = require('express');
const formidable = require('formidable');
const bodyParser = require('body-parser');
const admin = require('../controller/admin');
const passport = require('passport');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();

//获取用户列表数据
router.get('/user',passport.authenticate('bearer', { session: false }), function (req, res, next) {

});
//获取某一个用户数据
router.get('/user/:id', passport.authenticate('bearer', { session: false }), function (req, res, next) {

});
//注册某一个用户
router.post('/user', urlencodedParser, admin.register)
//修改用户数据
router.put('/user', passport.authenticate('bearer', { session: false }), function (req, res, next) {

});
//删除用户数据
router.delete('/user', passport.authenticate('bearer', { session: false }), function (req, res, next) {

});
//用户登录
router.post('/login', urlencodedParser, admin.login);
//用户登出
router.post('/signout', passport.authenticate('bearer', { session: false }), urlencodedParser, admin.signOut);
//上傳頭像
router.post('/avatar', passport.authenticate('bearer', { session: false }), admin.uploadAvatar);
//用户添加群
router.post('/group', passport.authenticate('bearer', { session: false }), )

module.exports = router;

