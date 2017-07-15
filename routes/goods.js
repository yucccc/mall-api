var express = require('express');
var router = express.Router()
var mongoose = require('mongoose')
var Computer = require('../models/computers')
var User = require('../models/user')
mongoose.connect('mongodb://127.0.0.1:27017/mymall')
// 电脑列表
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
    let computerModel = Computer.find(params).skip(skip).limit(pageSize);
    // 进行排序 1 升序 -1 降序
    sort && computerModel.sort({'salePrice': sort})
    computerModel.exec(function (err, doc) {
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
    // shopId = req.body.shopId;
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
                            if (item.id === productId) {
                                cartItem = item;
                                item.num++;
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
                            console.log('没找到')
                            // 没找到
                            Computer.findOne({productId: productId}, function (err3, doc3) {
                                if (err3) {
                                    res.json({
                                        status: '1',
                                        msg: err3.message,
                                        result: ''
                                    })
                                } else {
                                    let doc = {
                                        "id": doc3.productId,
                                        "img": doc3.productImageBig,
                                        "name": doc3.productTitle,
                                        "checked": 1,
                                        "num": 1,
                                        "price": doc3.salePrice
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

module.exports = router