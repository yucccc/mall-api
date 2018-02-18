const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
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
    'addressList': [
        {
            "addressId": Number,
            "userName": String,
            "streetName": String,
            "tel": Number,
            "isDefault": Boolean
        }
    ]
})
module.exports = mongoose.model('User', userSchema)
