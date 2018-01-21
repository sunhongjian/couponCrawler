const Koa = require('koa');
const app = new Koa();
const crawler = require('./crawler');

app.use(crawler.create);

app.listen(3000);