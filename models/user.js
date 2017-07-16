var mongoose = require('mongoose')
var userSchema = new mongoose.Schema({
    "userId": String,
    "name": String,
    "avatar": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [
        {
            "productId": String,
            "productImg": String,
            "productName": String,
            "checked": String,
            "productNum": Number,
            "productPrice": Number
        }
    ],
    'addressList': Array
})
module.exports = mongoose.model('User', userSchema)
