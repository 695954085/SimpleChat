import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  date: Date,
  token: String,
  email: String
})

// 密码验证
userSchema.method("comparePassword", function (password, callback) {
  bcrypt.compare(password, this.password, function (err, res) {
    if (err) {
      callback(err);
      return;
    }
    callback(null, res);
  });
});

userSchema.pre('save', function (next) {
  // 1. 如果一个plaintextpassword进行save的时候，保存plaintext是不安全的，所以要进行hash
  // 2. 但是如果仅仅只是修改用户表的其他信息，那么password就不需要进行操作了呀

  // 如果这个model是新的，就意味着注册新用户；或者是修改密码。密码都是需要进行hash
  if (this.isNew || this.isModified('password')) {
    // 进行密码hash
    bcrypt.hash(this.password, 10, (err, hash) => {
      // Store hash in your password DB.
      if (err) {
        next(err);
        return;
      }
      this.password = hash;
      next();
    });
  } else {
    next();
  }
})

var User = mongoose.model('User', userSchema);

export default User