const phantom = require('phantom');
const config = require('./config/default')

module.exports = {
  create: async (ctx, next) => {
    var URL = config.urlIndex;
    var instance = await phantom.create();
    var page = await instance.createPage();
    var status = await page.open(URL);
    if (status == 'success') {
      // 引入jq,操作dom
      await page.includeJs(config.jquery);
      var result = await page.evaluate(function () {
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
          content: data
        });
      })
      ctx.body = JSON.stringify(result.content);
      // 将数据写入文件
      // fs.writeFile('./data/data.json', JSON.stringify(result.content), function (err) {
      //   if (err) throw err;
      //   console.log('It\'s saved!');
      // });
    }
    await instance.exit();

  },
}