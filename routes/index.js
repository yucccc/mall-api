var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mymall', {useMongoClient: true})
var db = mongoose.connection
db.once("open", function () {
    console.log("数据库连接成功");
})
db.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});

db.on('disconnected', function () {
    console.log('数据库连接断开');
})
/* GET Home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
