var mongoose = require('mongoose')
// 表模型
var produtSchema = new mongoose.Schema({
    'productId':String,
    'productName':String,
    'salePrice':Number,
    'productImageSmall': Array,
    'productImageBig': String,
    // 'title': String,
    // 'news': String,
    // 'price': String,
    // dd: $('.dd').eq(0).text().trim(),
    // commentCount: $('#comment-count').find('.count').text()
})
module.exports = mongoose.model('Compuer', produtSchema)
