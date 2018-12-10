var mongoose = require('mongoose');

let env = process.env.NODE_ENV || 'development'
let dbUrl = 'mongodb://127.0.0.1:20811/taroStar'
// 开发环境连接测试使用的 MongoDB 服务器
if (env === 'development') {
  dbUrl = 'mongodb://127.0.0.1/taroStar'
}

mongoose.connect(dbUrl, { useNewUrlParser: true })

var UsersSchema = new mongoose.Schema({
  openid: String,
  session_key: String,
  userInfo: {
    nickName: String,
    gender: Number,
    language: String,
    city: String,
    province: String,
    country: String,
    avatarUrl: String,
  },
  note: [{
    title: String,
    date: String,
    repeat: String,
    top: Boolean,
    day: String,
    openid: String
  }]
})

module.exports = mongoose.model('Users', UsersSchema);