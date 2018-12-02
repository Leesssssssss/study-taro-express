const express = require('express');
const bodyParser = require('body-parser');
const Users = require('./db.js')
const app = express();
app.use(bodyParser.json());

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/getUserInfo', (req, res) => {
  var user = req.body;

  var UserInfo = new Users(user);
  Users.find({ openid: req.body.openid }).then(result => {
    if (result.length === 0) {
      UserInfo.save();
    } else {
    }
  })
  res.send('ok');
})

app.post('/addNote', (req, res) => {
  var note = req.body;
  console.log(note);
  Users.updateOne({ openid: req.body.openid },
    { $push: { note: note }},(err) => {
      console.log(err);
    });
  res.send('ok');
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))