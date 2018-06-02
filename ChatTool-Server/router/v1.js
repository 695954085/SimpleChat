const express = require('express');
const User = require('../model/user');
const formidable = require('formidable');
const bodyParser = require('body-parser');
const admin = require('../controller/admin');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();

//获取用户列表数据
router.get('/user', function (req, res, next) {

});
//获取某一个用户数据
router.get('/user/:id', function (req, res, next) {

});

//注册某一个用户
router.post('/user', urlencodedParser, admin.register)
//修改用户数据
router.put('/user', function (req, res, next) {

})
//删除用户数据
router.delete('/user', function (req, res, next) {

})
//用户登录
router.post('/login', urlencodedParser, admin.login);
//用户登出
router.post('/signout', urlencodedParser, admin.signOut);
//上傳頭像
router.post('/avatar', admin.uploadAvatar);

module.exports = router;

