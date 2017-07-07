var express = require('express');
var router = express.Router()
var mongoose = require('mongoose')
var Computer = require('../models/computers')
mongoose.connect('mongodb://127.0.0.1:27017/mymall')
// 电脑列表
router.get('/computer', function (req, res, next) {
    Computer.find({}, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: 'successful',
                result: {
                    count: doc.length,
                    data: doc
                }
            })
        }
    })
})
module.exports = router