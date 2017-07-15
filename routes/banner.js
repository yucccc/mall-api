// 轮播图接口
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Banner = require('../models/banner')
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
router.get('/', function (req, res, next) {
    Banner.find({}, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    data: doc
                }
            })
        }
    })
})
module.exports = router

