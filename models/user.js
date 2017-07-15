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
            "id": String,
            "name": String,
            "price": String,
            "img": String,
            "checked": String,
            "num": Number
        }
    ],
    'addressList': Array
})
module.exports = mongoose.model('User', userSchema)
