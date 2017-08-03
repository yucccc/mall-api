var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Good = require('../models/goods')
// 登陆接口
router.post('/login', function (req, res) {
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
                status: '0',
                msg: 'suc',
                result: {
                    name: doc.name,
                    avatar: doc.avatar
                }
            })
        })
    } else {
        res.json({
            status: '1',
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
    } else {
        res.json({
            status: '0',
            msg: '未登录',
            result: ''
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
// 删除购物车
router.post('/cartDel', function (req, res) {
    let userId = req.cookies.userId,
        productId = req.body.productId;
    User.update({userId}, {
        $pull: {
            'cartList': {
                'productId': productId
            }
        }
    }, function (err, doc) {
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
})
// 获取地址
router.post('/addressList', function (req, res) {
    let userId = req.cookies.userId,
        addressId = req.body.addressId || ''; // 地址id
    if (userId) {
        User.findOne({userId}, function (err, doc) {
            if (err) {
                res.json(
                    {
                        status: '1',
                        msg: err.message,
                        result: ''
                    }
                )
            } else {
                let addressList = doc.addressList;
                if (addressId) {
                    addressList.forEach(item => {
                        if (item.addressId == addressId) {
                            addressList = item
                        }
                    })
                }
                res.json(
                    {
                        status: '0',
                        msg: 'suc',
                        result: addressList
                    }
                )
            }
        })
    }
})
// 更新地址
router.post('/addressUpdate', function (req, res) {
    let userId = req.cookies.userId,
        addressId = req.body.addressId, // 地址id
        userName = req.body.userName,
        tel = req.body.tel,
        streetName = req.body.streetName,
        isDefault = req.body.isDefault || false;
    if (userId && addressId && userName && tel && streetName) {
        User.findOne({userId}, (err, userDoc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                let addressList = userDoc.addressList;
                if (isDefault) { // 如果修改了默认地址
                    addressList.forEach((item, i) => {
                        if (item.addressId === addressId) {
                            item.isDefault = true;
                            item.userName = userName;
                            item.tel = tel;
                            item.streetName = streetName;
                        } else {
                            item.isDefault = false;
                        }
                    })
                    // 保存数据
                    userDoc.save((err1, doc1) => {
                        if (err1) {
                            res.json({
                                status: '1',
                                msg: err1.message,
                                result: ''
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: 'suc1',
                                result: ''
                            })
                        }
                    })
                } else {
                    User.update({"addressList.addressId": addressId}, {
                        "addressList.$.userName": userName,
                        "addressList.$.tel": tel,
                        "addressList.$.streetName": streetName
                    }, (err2, doc2) => {
                        if (err2) {
                            res.json({
                                status: '0',
                                msg: err2.message,
                                result: ''
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: 'suc2',
                                result: ''
                            })
                        }
                    })

                }
            }
        })
    } else {
        res.json({
            status: '1',
            msg: '缺少必须参数',
            result: ''
        })
    }
})
// 添加地址
router.post('/addressAdd', function (req, res) {
    let userId = req.cookies.userId,
        userName = req.body.userName,
        tel = req.body.tel,
        streetName = req.body.streetName,
        isDefault = req.body.isDefault || false;
    if (userId && userName && tel && streetName) {
        User.findOne({userId}, (err, doc) => {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                let addressList = doc.addressList
                if (isDefault) {
                    addressList.forEach((item, i) => {
                        item.isDefault = false;
                    })
                }
                addressList.push({
                    "addressId": Date.parse(new Date()),
                    userName,
                    tel,
                    streetName,
                    isDefault: isDefault
                })
                doc.save((err1, doc1) => {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message,
                            result: ''
                        })
                    } else {
                        res.json({
                            status: '0',
                            msg: 'suc',
                            result: ''
                        })
                    }
                })
            }
        })
    } else {
        res.json({
            status: '1',
            msg: '缺少必须参数',
            result: ''
        })
    }
})
// 地址删除
router.post('/addressDel', function (req, res) {
    let userId = req.cookies.userId,
        addressId = req.body.addressId;
    if (userId && addressId) {
        User.update({userId}, {
            $pull: {
                'addressList': {
                    'addressId': addressId
                }
            }
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
    } else {
        res.json({
            status: '1',
            msg: '缺少必须参数',
            result: ''
        })
    }

})
// 支付接口

module.exports = router
