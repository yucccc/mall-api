const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://127.0.0.1:27017/mymall', {useMongoClient: true})
const db = mongoose.connection
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
router.all('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
