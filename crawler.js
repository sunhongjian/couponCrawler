const phantom = require('phantom');
module.exports = {
  create: async (ctx, next) => {
    var URL = 'http://s.hadefile.com/index/44612';
    var instance = await phantom.create();
    var page = await instance.createPage();
    var status = await page.open(URL);
    if (status == 'success') {
      var result = await page.evaluate(function () {
        var data = [];
        var list = document.querySelectorAll('.show-goods-list')
        for (var i = 0; i < list.length; i++) {
          data.push({ title: list[i].querySelector('.item-title').innerText })
        }
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