var mongoose = require('mongoose')
// 表模型
var produtSchema = new mongoose.Schema({
    'productId': String,
    'salePrice': Number,
    'productTitle': String,
    'productImageSmall': Array,
    'productImageBig': String,
    'stock': Number
})
module.exports = mongoose.model('Compuer', produtSchema)
