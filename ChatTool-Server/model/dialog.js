const mongoose = require('mongoose');

// 将来可以用来查看历史
var dialogSchema = mongoose.Schema({
  userList: [String], //用户列表
  owner: String, // 群主
  username: String, // 事主
  conversation: [{
    content: String,
    date: Date,
    username: String,
    contentType: String // 内容的类型 文字，图片，语音
  }]
})


var Dialog = mongoose.model('dialog', dialogSchema);

module.exports = Dialog;