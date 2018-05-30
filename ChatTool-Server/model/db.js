const mongoose = require('mongoose');
const config = require('config');

console.log(config.get('Customer.dbConfig.mongodb'))
console.log(process.env.NODE_ENV);
mongoose.connect(config.get('Customer.dbConfig.mongodb'));

var db = mongoose.connection;
db.on('error', console.error.bind(console, '数据库连接失败'));
db.once('open', console.log.bind(console, '数据库连接成功'));

exports.db = db;