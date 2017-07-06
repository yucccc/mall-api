var mongoose = require('mongoose')
var User = require('./../models/user')
mongoose.connect('mongodb://127.0.0.1:27017/mymall')
var data = [{
    "userId": "9527",
    "name": "陈二狗",
    "avatar": "http://osc9sqdxe.bkt.clouddn.com/defaultAvatar.jpg",
    "userName": "admin",
    "userPwd": "admin",
    "orderList": [
        {
            "orderId": "6224201705302250301",
            "orderTotal": 3359,
            "addressInfo": {
                "addressId": "100001",
                "userName": "JackBean",
                "streetName": "北京市朝阳区朝阳公园",
                "postCode": 100001,
                "tel": 12345678901.0,
                "isDefault": true
            },
            "goodsList": [
                {
                    "productImage": "mi6.jpg",
                    "salePrice": "2499",
                    "productName": "小米6",
                    "productId": "201710006",
                    "productNum": "1",
                    "checked": "1"
                },
                {
                    "productImage": "2.jpg",
                    "salePrice": "80",
                    "productName": "头戴式耳机-3",
                    "productId": "201710004",
                    "productNum": "7",
                    "checked": "1"
                }
            ],
            "orderStatus": "1",
            "createDate": "2017-05-30 22:50:30"
        }
    ],
    "cartList": [
        {
            "productImage": "1.jpg",
            "salePrice": "129",
            "productName": "小钢炮蓝牙音箱",
            "productId": "201710017",
            "productNum": "6",
            "checked": "0"
        }
    ],
    "addressList": [
        {
            "addressId": "100001",
            "userName": "JackBean",
            "streetName": "北京市朝阳区朝阳公园",
            "postCode": "100001",
            "tel": "12345678901",
            "isDefault": true
        }
    ],
}]
function initAdmin() {
    User.insertMany(data)
}
module.exports = initAdmin