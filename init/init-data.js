// 初始化数据库
const getGoods = require('./getGoods')
const getAdmin = require('./admin');

;( async () => {
    await getGoods();
    await getAdmin();
    process.exit(()=> {
        console.log('抓取完毕');
    })
})()



