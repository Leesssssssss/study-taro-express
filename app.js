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
      if (err) {
        console.log(err);
       }
    })
  res.send('存储用户信息成功');
})

// 存储用户备忘录
app.post('/addNote', (req, res) => {
  var note = req.body;
  var openid = req.body.openid;
  var top = req.body.top;

  if (top === false) {
    Users.find({ openid: openid }).then(result => {
      if (result[0].note.length === 0) {
        Users.updateOne({ openid: openid },
          {
            $push: {
              note: {
                title: req.body.title,
                date: req.body.date,
                repeat: req.body.repeat,
                top: true,
                day: req.body.day,
                openid: req.body.openid
              }
            }
          }, (err) => {
            if (err) {
              console.log(err);
             }
          });
      }
    })
    res.send('存储备忘录成功');
    return;
  }

  if (top === true) {
    Users.update({ openid: openid, 'note.top': true }, { $set: { 'note.$.top': false } }, (err) => {
      if (err) {
        console.log(err);
       }
    })
  }

  Users.updateOne({ openid: openid },
    { $push: { note: note } }, (err) => {
      if (err) {
        console.log(err);
       }
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


// 删除备忘录
app.post('/deleteNote', (req, res) => {
  var openid = req.body.openid;
  var _id = req.body._id;

  Users.updateOne({ openid: openid }, { $pull: { note: { _id: _id } } }, (err => {
    if (err) {
      console.log(err);
     }
  }))
  res.send('删除备忘录成功');
})

// 修改备忘录
app.post('/updateNote', (req, res) => {
  var openid = req.body.openid;
  var note = req.body;

  if (note.top === true) {
    Users.update({ openid: openid, 'note.top': true }, { $set: { 'note.$.top': false } }, (err) => {
      if (err) {
        console.log(err);
       }
    })
  }

  Users.update({ openid: openid, 'note._id': note._id }, { $set: { 
    'note.$.title': note.title,
    'note.$.date': note.date,
    'note.$.repeat': note.repeat,
    'note.$.top': note.top,
    'note.$.day': note.day
   } }, (err) => {
     if (err) {
      console.log(err);
     }
   })

  res.send('修改备忘录成功');
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))