const express     = require('express');
const router      = express.Router()
const Good        = require('../models/goods')
const User        = require('../models/user')
const superagent  = require('superagent')

// 商品列表
router.get('/computer',  (req, res, next) => {
    let sort = req.query.sort || '';
    let page = +req.query.page || 1;
    let pageSize = +req.query.pageSize || 20;
    let priceGt = +req.query.priceGt || ''; // 大于
    let priceLte = +req.query.priceLte || ''; // 小于
    let skip = (page - 1) * pageSize;//跳过多少条
    let params = {}
    if (priceGt || priceLte) {
        if (priceGt && priceLte) {
            if (priceGt > priceLte) {
                var l = priceLte, g = priceGt
                priceGt = l
                priceLte = g
            }
            params = {
                'salePrice': {
                    $gt: priceGt,
                    $lte: priceLte
                }
            }
        } else {
            params = {
                'salePrice': {
                    $gt: priceGt || 0,
                    $lte: priceLte || 99999
                }
            }
        }
    }

    let productModel = Good.find(params).skip(skip).limit(pageSize);
    // 1 升序 -1 降序
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
router.post('/addCart',  async (req, res) => {

    let userId = req.cookies.userId;
    let {productId, productNum = 1 } = req.body
    if (userId) {
        try {
            const userDoc = await User.findOne({userId})
            if (userDoc) {
                // 商品是否存在
                let have = false;

                //  购物车有内容
                if (userDoc.cartList.length) {
                    // 遍历用户名下的购物车列表
                    for (let value of userDoc.cartList) {
                        // 找到该商品
                        if (value.productId === productId) {
                            have = true;
                            value.productNum += productNum;
                            break;
                        }
                    }

                }

                // 购物车无内容 或者 未找到商品 则直接添加
                if (!userDoc.cartList.length || !have) {
                    const goodsDoc = await Good.findOne({productId})
                    let doc = {
                        "productId": goodsDoc.productId,
                        "productImg": goodsDoc.productImageBig,
                        "productName": goodsDoc.productName,
                        "checked": "1",
                        "productNum": productNum,
                        "productPrice": goodsDoc.salePrice
                    };
                    userDoc.cartList.push(doc)
                }

                userDoc.save( ()=> {
                    // 保存成功
                    res.json({
                        status: 0,
                        msg: '加入成功',
                        result: 'suc'
                    })
                })

            } else {
                res.json({
                    status: 1,
                    msg: '用户不存在',
                    result: ''
                })
            }

        } catch (err) {
            res.json({
                status: 1,
                msg: err.message,
                result: ''
            })
        }

    } else {
        res.json({
            status: 1,
            msg: '用户未登录',
            result: ''
        })
    }
})

// 批量加入购物车
router.post('/addCartBatch',  async (req, res) => {
    let userId = req.cookies.userId,
        productMsg = req.body.productMsg;
    if (userId) {
        try {
            User.findOne({userId}, (err, userDoc) => {
                if (userDoc) {
                    // 未添加的商品
                    let sx = [];
                    let newSx = [];
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

                                    // 保存成功
                                    res.json({
                                        status: '0',
                                        msg: '加入成功',
                                        result: 'suc'
                                    })

                                })


                                // }
                            })
                        } else {
                            userDoc.save(function (err2, doc2) {

                                // 保存成功
                                res.json({
                                    status: '0',
                                    msg: '加入成功',
                                    result: 'suc'
                                })

                            })
                        }

                    } else {
                        var goodList = [], goodNum = []
                        productMsg.forEach(item => {
                            goodList.push(item.productId)
                            goodNum.push(item.productNum)
                        })
                        Good.find({productId: {$in: goodList}}, function (err3, doc) {

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
                                // 保存成功
                                res.json({
                                    status: '0',
                                    msg: '加入成功',
                                    result: 'suc'
                                })
                            })

                        })
                    }
                }

            })
        } catch (err) {
            res.json({
                status: 1,
                msg: err.message,
                result: ''
            })
        }

    } else {
        res.json({
            status: 1,
            msg: '未登录',
            result: ''
        })
    }

})

let czUrl = 'http://www.smartisan.com/product/home'

// 转发锤子接口
router.get('/productHome', function (req, res) {
    superagent.get(czUrl).end(function (err, res1) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            let result = JSON.parse(res1.text)
            let home_hot = result.data.home_hot || ['100031816', '100032201', '100025104', '100023501'];
            let home_floors = result.data.home_floors
            let pId = [], // 保存总商品id
                hotId = [], // 热门id
                floorsId = [],// 官方精选 品牌精选
                floorsList = [];
            home_hot.forEach(item => {
                hotId.push(item.spu_id + '01')
                pId.push(item.spu_id + '01')
            })
            home_floors.forEach((item, i) => {
                let tab_items = item.tabs[0].tab_items // 
                floorsId[i] = []
                floorsList[i] = {};
                floorsList[i].tabs = [];
                floorsList[i].image = home_floors[i].tabs[0].tab_items[0]
                floorsList[i].title = home_floors[i].title
                tab_items.forEach(tab => {
                    let id = tab.spu_id
                    if (id) {
                        floorsId[i].push(id + '01') // 存储id
                        pId.push(id + '01')
                    }
                })
            })
            Good.find({productId: {$in: pId}}, (goodsErr, goodsDoc) => {
                if (goodsErr) {
                    res.json({
                        status: '1',
                        msg: goodsErr.message,
                        result: ''
                    })
                } else {
                    let hotList = [];
                    goodsDoc.forEach(item => {
                        let itemId = item.productId;
                        hotId.forEach(id => {
                            if (itemId === id) {
                                hotList.push(item)
                            }
                        })
                        floorsId.forEach((fitem, i) => {
                            fitem.forEach(fid => {
                                if (itemId === fid) {
                                    floorsList[i].tabs.push(item)
                                }
                            })
                        })
                    })


                    res.json({
                        status: '0',
                        msg: 'suc',
                        result: {
                            "home_hot": hotList,
                            'home_floors': floorsList
                        }
                    })
                }
            })


        }
    })
})

// 商品信息
router.get('/productDet', function (req, res) {
    let productId = req.query.productId
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



