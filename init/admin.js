var mongoose = require('mongoose')
var User = require('./../models/user')
mongoose.connect('mongodb://127.0.0.1:27017/mymall')
function initAdmin() {
    User.insertMany({
        "userId": "9527",
        "name": "陈二狗",
        "avatar": "http://osc9sqdxe.bkt.clouddn.com/defaultAvatar.jpg",
        "userName": "admin",
        "userPwd": "admin",
        "orderList": [],
        "cartList": [],
        "addressList": []
    })
}
module.exports = initAdmin