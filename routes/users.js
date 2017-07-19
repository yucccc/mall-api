var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Good = require('../models/goods')
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
// 登出登陆
router.post('/loginOut', function (req, res) {
    res.cookie("userId", "", {
        path: "/",
        maxAge: -1
    });
    res.json({
        status: "0",
        msg: '',
        result: ''
    })
})
// 获取用户信息
router.post('/userInfo', function (req, res) {
    let userId = req.cookies.userId
    if (userId) {
        User.findOne({userId}, function (err, doc) {
            res.json({
                status: '1',
                msg: 'suc',
                result: {
                    name: doc.name,
                    avatar: doc.avatar
                }
            })
        })
    } else {
        res.json({
            status: '0',
            msg: '未登录',
            result: ''
        })
    }
})
// 获取购物车
router.post('/cartList', function (req, res) {
    let userId = req.cookies.userId;
    if (userId) {
        // 去查用户名下的
        User.findOne({userId: userId}, function (err, userDoc) {
            if (userDoc) {
                res.json({
                    status: '1',
                    msg: "suc",
                    count: userDoc.cartList.length,
                    result: userDoc.cartList
                })
            }
        })
    }
})
// 修改数量
router.post('/cartEdit', function (req, res) {
    let userId = req.cookies.userId,
        productId = req.body.productId,
        productNum = req.body.productNum > 10 ? 10 : req.body.productNum,
        checked = req.body.checked;
    if (userId) {
        User.update({"userId": userId, "cartList.productId": productId}, {
            "cartList.$.productNum": productNum,
            "cartList.$.checked": checked,
        }, (err, doc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                });
            } else {
                res.json({
                    status: '0',
                    msg: '',
                    result: 'suc'
                });
            }
        })
    }

})
// 全选
router.post('/editCheckAll', function (req, res) {
    let userId = req.cookies.userId,
        checkAll = req.body.checkAll ? '1' : '0';
    User.findOne({userId}, function (err, doc) {
        if (err) {
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                doc.cartList.forEach(item => {
                    item.checked = checkAll
                })
                doc.save(function (err1, doc) {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1, message,
                            result: ''
                        });
                    } else {
                        res.json({
                            status: '0',
                            msg: '',
                            result: 'suc'
                        });
                    }
                })
            }
        }
    })
})
module.exports = router
