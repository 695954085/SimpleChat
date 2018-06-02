const mongoose = require('mongoose');


var dialogSchema = mongoose.Schema({
  userList: [String],
  conversation: [{
    content: String,
    date: Date,
    user: String,
    contentType: String
  }]
})


var Dialog = mongoose.model('dialog', dialogSchema);

module.exports = Dialog;