import mongoose from 'mongoose'
import Promise from 'bluebird'
import config from 'config'

Promise.promisifyAll(mongoose)
mongoose.connect(config.get('Customer.dbConfig.mongodb'))
var db = mongoose.connection
db.on('error', console.error.bind(console, '数据库连接失败'))
// db.once('open', console.log.bind(console, '数据库连接成功'))
export default db