const mongoose = require('mongoose');
const Promise = require('bluebird');
Promise.promisifyAll(mongoose);
const config = require('config');

mongoose.connect(config.get('Customer.dbConfig.mongodb'));

var db = mongoose.connection;
db.on('error', console.error.bind(console, '数据库连接失败'));
db.once('open', console.log.bind(console, '数据库连接成功'));

exports.db = db;