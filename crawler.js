const phantom = require('phantom');
const config = require('./config/default');
const fs = require('fs');

let allData = [];
const crawler = {
  MAX_PAGE: 5,
  implement: async (pageNum) => {
    var URL = config.lowPrice+pageNum;
    var instance = await phantom.create();
    var page = await instance.createPage();
    var status = await page.open(URL);
    if (status == 'success') {
      // 引入jq,操作dom
      await page.includeJs(config.jquery);
      var result = await page.evaluate(function () {
        //jsonp
        var a = $('.show-goods-list')
        var data = [];
        var list = $('.show-goods-list');
        $.each(list, function (idx, item) {
          var $item = $(item);
          data.push({
            // 标题
            title: $item.find('.item-title').text(),
            // 主图地址
            picPath: $item.find('img').attr("src"),
            // 券后价格
            price: $item.find('.goods-price-discribe p').eq(1).text(),
            // 券面值
            couponPrice: $item.find('.goods-price-discribe p').eq(0).text()
          })
        })
        return ({
          // 条目数
          dataLength: list.length,
          // 数据内容
          content: data
        });
      })
    }
    await instance.exit();
    if(result.dataLength > 0 && pageNum <= crawler.MAX_PAGE) {
      // 将旧文件中的数据提取出来,把新数据拼上重新储存到原文件
      var oldFileString = fs.readFileSync('data/data.json').toString();
      var fileData = '';
      if(oldFileString) {
        fileData = JSON.stringify(JSON.parse(oldFileString).concat(result.content));
      } else {
        fileData = JSON.stringify(result.content);
      }
      fs.writeFile('data/data.json', fileData , function (err) {
        if (err) throw err;
        console.log('小丁便宜购第'+pageNum+'已被写入');
      });
      allData.concat(result.content);
      await crawler.implement(pageNum+1)
    } else {
      return allData;
    }  
  }
}
module.exports = {
  create: async (ctx, next) => {
    const start = new Date()
    let pageNum = 1;
    const result = await crawler.implement(pageNum);
    ctx.body = JSON.stringify(result);
    // 统计爬虫时间
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  },
}