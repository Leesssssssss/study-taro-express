var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/taroStar', { useNewUrlParser: true });

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
    day: String
  }]
})

module.exports = mongoose.model('Users', UsersSchema);