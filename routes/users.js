var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Good = require('../models/computers')
// 登陆接口
router.post('/login', function (req, res, next) {
    var params = {
        userName: req.body.userName,
        userPwd: req.body.userPwd
    }
    User.findOne(params, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else if (doc) {
            res.cookie("userId", doc.userId, {
                path: '/',
                maxAge: 1000 * 60 * 60
            });
            res.json({
                status: '0',
                msg: '登陆成功',
                result: {
                    name: doc.name,
                    avatar: doc.avatar
                }
            })
        } else {
            res.json({
                status: '1',
                msg: '账号或者密码错误',
                result: ''
            })
        }
    })
})
// 获取购物车
router.post('/cartList', function (req, res) {
    // 如果有用户信息
    var userId = '';
    if (userId) {
        // 去查用户名下的
    } else {
        // 根据id查
        var goodsId = req.body.goodsList;
        goodsId.length && Good.find({"productId": {$in: goodsId}}, {_id: 0, __v: 0}, function (err, doc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                res.json({
                    status: '0',
                    msg: 'success',
                    count: doc.length,
                    result: doc
                })
            }
        })
    }
})
// 加入购物车
// router.post('/addCart', function (req, res) {
//     var userId = '';
//     if (userId) {
//     } else {
//         // 接收一个id
//         var goodsId = req.body.goodsId;
//         goodsId && Good.findOne({"productId": goodsId}, function (err, doc) {
//             if (err) {
//                 res.json({
//                     status: '1',
//                     msg: err.message,
//                     result: ''
//                 })
//             } else {
//                 res.json({
//                     status: '0',
//                     msg: 'success',
//                     result: ''
//                 })
//             }
//         })
//     }
// })

module.exports = router
