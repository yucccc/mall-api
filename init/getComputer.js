// 爬取京东电脑商品
var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var superagent = require('superagent');
var mongoose = require('mongoose')
var Computer = require('../models/computers')
mongoose.connect('mongodb://127.0.0.1:27017/mymall')

var ep = new eventproxy();
var productId = 20170705;// 商品id
var pageUrls = [],
    urlsArray = [],
    pageNum = 10; // 抓取的页面数量
for (let i = 1; i <= pageNum; i++) {
    pageUrls.push('https://list.jd.com/list.html?cat=670,671,672&page=' + i + '&sort=sort_totalsales15_desc&trans=1&JL=6_0_0#J_main')
}
// var grabUrl = [];
// var totalData = []; // 总数据
function getComputer() {
    superagent.get('https://list.jd.com/list.html?cat=670,671,672').end(function (err, res) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);
        $('.gl-warp .gl-item').each(function (idx, element) {
            var $element = $(element);
            var href = 'https:' + $element.find('.p-img >a').attr('href')
            topicUrls.push(href);// 获取所有url
        });
        // 监听一个自定义事件 data为返回的数据
        ep.after('grabUrl', topicUrls.length, function (data) {
            data = data.map(function (topicPair) {
                var imgList = []
                var $ = cheerio.load(topicPair);
                var salePrice = Math.ceil(Math.random() * 10000)
                $('#spec-list img').each(function (i, e) {
                    var small = 'https:' + $(e).attr('src')
                    imgList.push(small)
                })
                // console.log(1)
                return ({
                    productId: productId++,
                    productName: '笔记本电脑' + productId++,
                    salePrice: salePrice,
                    // test:$('#navitems-group1 .fore1').text().trim(),
                    productImageSmall: imgList,
                    productImageBig: 'https:' + $('#spec-img').data('origin'),
                    // title: $('#spec-list img').eq(0).attr('alt'),
                    // news: $('#p-ad').text(),
                    // price: $('.itemInfo-wrap .J-summary-price .p-price >.price').text(),
                    // dd: $('.dd').eq(0).text().trim(),
                    // commentCount: $('#comment-count').find('.count').text()
                });
            });
            // console.log(2)
            // totalData.push(data)
            Computer.insertMany(data)
            // callback()
            // console.log(data)
        })
        topicUrls.forEach(function (url, i) {
            superagent.get(url).end(function (err, res) {
                ep.emit('grabUrl', res.text);
            })
        })
    })
    // pageUrls.forEach(function (url) {//遍历所有的页面
    //     superagent.get(url).end(function (err, res) {//取得所有页面的url
    //         var $ = cheerio.load(res.text)
    //         $('.gl-warp .gl-item').each(function (idx, element) {
    //             var $element = $(element);
    //             var href = 'https:' + $element.find('.p-img >a').attr('href')
    //             topicUrls.push(href);// 获取所有url
    //         });
    //     })
    // })
}
// getData()
module.exports = getComputer