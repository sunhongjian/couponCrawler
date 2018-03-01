const Koa = require('koa');
const app = new Koa();
const crawler = require('./crawler');
var colors = require('colors');  
  
  
colors.setTheme({  
    silly: 'rainbow',  
    input: 'grey',  
    verbose: 'cyan',  
    prompt: 'red',  
    info: 'green',  
    data: 'blue',  
    help: 'cyan',  
    warn: 'yellow',  
    debug: 'magenta',  
    error: 'red'  
});  

console.log('服务已经启动'.green);
app.use(crawler.create);

app.listen(3000);