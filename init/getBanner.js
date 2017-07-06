var mongoose = require('mongoose')
var Banner = require('./../models/banner')
mongoose.connect('mongodb://127.0.0.1:27017/mymall')

var data = []
function getBannre() {
    for (let i = 1; i <= 7; i++) {
        data.push(
            {
                "alt": "图片描述" + i,
                "href": "/",
                "index": "0",
                "src": "http://osc9sqdxe.bkt.clouddn.com/" + i + ".jpg"
            }
        )
    }
    Banner.insertMany(data)
}

module.exports = getBannre