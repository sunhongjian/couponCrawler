const Koa = require('koa');
const app = new Koa();
const crawler = require('./crawler');

console.log('服务已经启动');
app.use(crawler.create);

app.listen(3000);