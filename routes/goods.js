var express = require('express');
var router = express.Router()
var mongoose = require('mongoose')
var Good = require('../models/goods')
var User = require('../models/user')
var superagent = require('superagent')

mongoose.connect('mongodb://127.0.0.1:27017/mymall')

// 商品列表
router.get('/computer', function (req, res, next) {
    let sort = req.param('sort') || '';
    let page = +req.param('page') || 1;
    let pageSize = +req.param('pageSize') || 20;
    let priceGt = +req.param('priceGt') || '';
    let priceLte = +req.param('priceLte') || '';
    let skip = (page - 1) * pageSize;//跳过多少条
    let params = {}
    if (priceGt && priceLte) {
        params = {
            'salePrice': {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }
    // 返回一个模型
    let productModel = Good.find(params).skip(skip).limit(pageSize);
    // 进行排序 1 升序 -1 降序
    sort && productModel.sort({'salePrice': sort})
    productModel.exec(function (err, doc) {
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

// 加入购物车
router.post('/addCart', function (req, res, next) {
    let userId = req.cookies.userId;
    let productId = req.body.productId;
    let productNum = req.body.productNum || 1;
    if (userId) {
        User.find({userId: userId}, function (err, userDoc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                if (userDoc) {
                    var userDoc = userDoc[0]
                    var cartItem = '';
                    //  购物车有内容
                    if (userDoc.cartList.length) {
                        // 遍历用户名下的购物车列表
                        userDoc.cartList.forEach(item => {
                            // 找到该商品
                            if (item.productId === productId) {
                                cartItem = item;
                                item.productNum += productNum;
                            }
                        })
                        if (cartItem) {
                            userDoc.save(function (err2, doc2) {
                                if (err2) {
                                    res.json({
                                        status: '1',
                                        msg: err2.message,
                                        result: ''
                                    })
                                } else {
                                    // 保存成功
                                    res.json({
                                        status: '0',
                                        msg: '加入成功',
                                        result: 'suc'
                                    })
                                }
                            })
                        }
                        // 保存数据
                        if (!cartItem) {
                            // 没找到
                            Good.findOne({productId: productId}, function (err3, doc3) {
                                if (err3) {
                                    res.json({
                                        status: '1',
                                        msg: err3.message,
                                        result: ''
                                    })
                                } else {
                                    let doc = {
                                        "productId": doc3.productId,
                                        "productImg": doc3.productImageBig,
                                        "productName": doc3.productName,
                                        "checked": "1",
                                        "productNum": productNum,
                                        "productPrice": doc3.salePrice
                                    };
                                    userDoc.cartList.push(doc)
                                    userDoc.save(function (err2, doc2) {
                                        if (err2) {
                                            res.json({
                                                status: '1',
                                                msg: err2.message,
                                                result: ''
                                            })
                                        } else {
                                            // 保存成功
                                            res.json({
                                                status: '0',
                                                msg: '加入成功',
                                                result: 'suc'
                                            })
                                        }
                                    })
                                }
                            })
                        }

                    } else {
                        console.log('内容为空')
                        // 没找到
                        Good.findOne({productId: productId}, function (err3, doc3) {
                            if (err3) {
                                res.json({
                                    status: '1',
                                    msg: err3.message,
                                    result: ''
                                })
                            } else {
                                let doc = {
                                    "productId": doc3.productId,
                                    "productImg": doc3.productImageBig,
                                    "productName": doc3.productName,
                                    "checked": "1",
                                    "productNum": 1,
                                    "productPrice": doc3.salePrice
                                };
                                userDoc.cartList.push(doc)
                                userDoc.save(function (err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: '1',
                                            msg: err2.message,
                                            result: ''
                                        })
                                    } else {
                                        // 保存成功
                                        res.json({
                                            status: '0',
                                            msg: '加入成功',
                                            result: 'suc'
                                        })
                                    }
                                })
                            }
                        })
                    }
                } else {
                    console.log("没找到用户？？")
                    // 直接加入
                }
            }
        })
    } else {
        res.json({
            status: '1',
            msg: '未登录',
            result: ''
        })
    }
})

// 批量加入购物车  后期改
router.post('/addCart1', function (req, res) {
    let userId = req.cookies.userId,
        productMsg = req.body.productMsg;
    if (userId) {
        User.findOne({userId}, (err, userDoc) => {
            if (err) {
                res.json({
                    status: '0',
                    msg: err.message,
                    result: ''
                })
            } else {
                if (userDoc) {
                    // 未添加的商品
                    let sx = [];
                    let newSx = []; //
                    //  购物车有内容
                    if (userDoc.cartList.length) {
                        // 遍历用户名下的购物车列表
                        userDoc.cartList.forEach((item, i) => {
                            // 找到该商品
                            productMsg.forEach((pro, j) => {
                                if (item.productId === pro.productId) {
                                    sx.push(j)
                                    item.productNum += pro.productNum
                                }
                            })
                        })
                        // 有不是重复的商品
                        if (sx.length !== productMsg.length) {
                            productMsg.forEach((item, i) => {
                                if (sx[i] !== i) {//  找到未添加的
                                    newSx.push(item)
                                }
                            })
                            let goodList1 = [], goodNum1 = []
                            newSx.forEach(item => {
                                goodList1.push(item.productId)
                                goodNum1.push(item.productNum)
                            })
                            Good.find({productId: {$in: goodList1}}, function (err3, goodDoc) {
                                if (err3) {
                                    res.json({
                                        status: '1',
                                        msg: err3.message,
                                        result: ''
                                    })
                                } else {
                                    var userCart = []
                                    // 返回一个数组
                                    goodDoc.forEach((item, i) => {
                                        // userCart.push()
                                        userDoc.cartList.push({
                                            "productId": item.productId,
                                            "productImg": item.productImageBig,
                                            "productName": item.productName,
                                            "checked": "1",
                                            "productNum": goodNum1[i],
                                            "productPrice": item.salePrice
                                        })
                                    })
                                    // if (userCart.length) {
                                    userDoc.save(function (err2, doc2) {
                                        if (err2) {
                                            res.json({
                                                status: '1',
                                                msg: err2.message,
                                                result: ''
                                            })
                                        } else {
                                            console.log(1111111)
                                            // 保存成功
                                            res.json({
                                                status: '0',
                                                msg: '加入成功',
                                                result: 'suc'
                                            })
                                        }
                                    })
                                }

                                // }
                            })
                        } else {
                            userDoc.save(function (err2, doc2) {
                                if (err2) {
                                    res.json({
                                        status: '1',
                                        msg: err2.message,
                                        result: ''
                                    })
                                } else {
                                    // 保存成功
                                    res.json({
                                        status: '0',
                                        msg: '加入成功',
                                        result: 'suc'
                                    })
                                }
                            })
                        }

                    } else {
                        var goodList = [], goodNum = []
                        productMsg.forEach(item => {
                            goodList.push(item.productId)
                            goodNum.push(item.productNum)
                        })
                        Good.find({productId: {$in: goodList}}, function (err3, doc) {
                            if (err3) {
                                res.json({
                                    status: '1',
                                    msg: err3.message,
                                    result: ''
                                })
                            } else {
                                console.log(doc)
                                // 返回一个数组
                                doc.forEach((item, i) => {
                                    userDoc.cartList.push({
                                        "productId": item.productId,
                                        "productImg": item.productImageBig,
                                        "productName": item.productName,
                                        "checked": "1",
                                        "productNum": goodNum[i],
                                        "productPrice": item.salePrice
                                    })
                                })

                                userDoc.save(function (err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: '1',
                                            msg: err2.message,
                                            result: ''
                                        })
                                    } else {
                                        // 保存成功
                                        res.json({
                                            status: '0',
                                            msg: '加入成功',
                                            result: 'suc'
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
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

// 转发锤子接口
router.get('/productHome', function (req, res) {
    superagent.get('http://www.smartisan.com/product/home').end(function (err, res1) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            let result = JSON.parse(res1.text)
            res.json({
                status: '0',
                msg: 'suc',
                result: result
            })
        }
    })
})

// 商品信息
router.get('/productDet', function (req, res) {
    let productId = req.param('productId')
    Good.findOne({productId}, (err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '1',
                msg: 'suc',
                result: doc
            })
        }
    })
})

module.exports = router