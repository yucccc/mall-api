// 爬取京东电脑商品
var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var request = require('superagent')
var superagent = require('superagent-charset')(request)
var mongoose = require('mongoose')
var Good = require('../models/goods')
mongoose.connect('mongodb://127.0.0.1:27017/mymall')
let ep = new eventproxy();
let baseUrl = 'http://www.smartisan.com';
function getGoods() {
    let ListLength = true, requestUrlLength = 5;
    let requestUrl = [];// 请求的url
    for (let i = 1; i < requestUrlLength; i++) {
        requestUrl.push(`${baseUrl}/product/spus?page_size=20&category_id=62&page=${i}&sort=sort`)
    }
    ep.after('grabUrl', requestUrl.length, (data) => {//data是所有数据
        let productUrl = [];
        data.forEach(function (item) {
            let item1 = JSON.parse(item)
            let list = item1.data.list
            list.forEach(list1 => { //每一项
                let id = list1.id
                productUrl.push(`${baseUrl}/product/skus/${id}01?with_spu_sku=true&with_stock=true`)
            })
        });
        ep.after('productData', productUrl.length, (data) => {
            data = data.map((item, i) => {
                let item1 = JSON.parse(item); //商品信息
                let data1 = item1.data;
                let pro = {
                    productId: data1.id,
                    salePrice: data1.price,
                    productName: data1.shop_info.title,
                    sub_title: data1.shop_info.shop_info,// 描述
                    limit_num: data1.shop_info.limit_num,// 限购
                    productImageSmall: data1.shop_info.ali_images,// 小图
                    productImageBig: data1.shop_info.ali_image,// 主题
                    productMsg: data1.shop_info.tpl_content.base.images.ali,
                    stock: 10
                }
                return pro
            })
            Good.insertMany(data)
        })
        // 根据url去请求
        productUrl.forEach(url => {
            superagent.get(url).end((err2, res2) => {
                ep.emit('productData', res2.text); // 每次请求的数据 获取id
            })
        })
    })

    requestUrl.forEach((item, i) => {
        superagent.get(item).end((err1, res1) => {
            ep.emit('grabUrl', res1.text); // 每次请求的数据 获取id
        })
    })

}
module.exports = getGoods