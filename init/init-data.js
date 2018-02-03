// 初始化数据库
const getGoods = require('./getGoods')
const getAdmin = require('./admin');

;(async () => {
    await getGoods();
    await getAdmin();
    process.on('exit', (code) => {
        console.log(`数据抓取完毕`);
    });
    process.exit()
})()



