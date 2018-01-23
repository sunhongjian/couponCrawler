const phantom = require('phantom');
const config = require('./config/default')

module.exports = {
  create: async (ctx, next) => {
    var URL = config.urlIndex;
    var instance = await phantom.create();
    var page = await instance.createPage();
    var status = await page.open(URL);
    if (status == 'success') {
      // 
      await page.includeJs(config.jquery);
      var result = await page.evaluate(function () {
        var a = $('.show-goods-list')
        var data = [];
        var list = $('.show-goods-list');
        // for (var i = 0; i < list.length; i++) {
        $.each(list, function (idx, item) {
          data.push({
            // 标题
            title: $(item).find('.item-title').text(),
            // 主图地址
            picPath: $(item).find('img').attr("src"),
            // 券后价格
            price: $(item).find('.goods-price-discribe p').text()
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