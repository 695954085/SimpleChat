import mongoose from 'mongoose'

// 将来可以用来查看历史
var dialogSchema = mongoose.Schema({
  // userList: [String], // 用户列表
  owner: String, // 群主
  roomId: String, 
  conversation: [{
    content: String,
    date: Date,
    username: String,
    contentType: String // 内容的类型 文字，图片，语音
  }]
})

const Dialog = mongoose.model('dialog', dialogSchema);

export default Dialog