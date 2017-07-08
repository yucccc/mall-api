var express = require('express');
var router = express.Router()
var mongoose = require('mongoose')
var Computer = require('../models/computers')
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
module.exports = router