const express = require('express');
const bodyParser = require('body-parser');
const Users = require('./db.js')
const app = express();
app.use(bodyParser.json());

// 跨域
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

// 存储用户openid
app.post('/getOpenId', (req, res) => {
  var openid = req.body;

  var UserInfo = new Users(openid);
  Users.find({ openid: req.body.openid }).then(result => {
    if (result.length === 0) {
      UserInfo.save();
    }
  })
  res.send('存储openid成功');
})


// 存储用户信息
app.post('/getUserInfo', (req, res) => {
  var openid = req.body.openid;
  var userInfo = req.body.userInfo;

  Users.updateOne({ openid: openid },
    { $set: { userInfo: userInfo } }, (err) => {
      // console.log(err);
    })
  res.send('存储用户信息成功');
})

// 存储用户备忘录
app.post('/addNote', (req, res) => {
  var note = req.body;
  var openid = req.body.openid;
  var top = req.body.top;

  if (top === true) {
    Users.update({ openid: openid, 'note.top': true }, { $set: { 'note.$.top': false } }, (err) => {
      console.log(err);
    })
  }
  Users.updateOne({ openid: openid },
    { $push: { note: note } }, (err) => {
      // console.log(err);
    });
  res.send('存储备忘录成功');
})

// 获取用户备忘录
app.post('/getNote', (req, res) => {
  var openid = req.body.openid;
  var note = []
  Users.find({ openid: openid }).then(result => {
    note = result[0].note;
    res.send(note);
  })
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))