var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var db = mongoose.connect('mongodb://127.0.0.1:27017/mymall')
db.connection.on("open", function () {
    console.log("数据库连接成功");
})
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});

db.connection.on('disconnected', function () {
    console.log('数据库连接断开');
})
/* GET Home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
