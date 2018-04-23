var schedule = require('node-schedule'); 
var message = require('./message');
var crawl = require('./crawl');


module.exports = function (app) {
  console.log(app.get('frontendRobot'));
  //避免第一次没有创建文件夹目录
  crawl.init(app);
  setTimeout(() => message.init(), 60000);

  (function () {
    let rule = new schedule.RecurrenceRule();
    rule.second = 0;
    rule.minute = [0, 30];
    rule.hour = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    rule.dayOfWeek = [1, 2, 3, 4, 5];
    schedule.scheduleJob(rule, function () {
      message.init(app);
    });
  })();


  //每小时抓取内容
  (function () {
    let rule = new schedule.RecurrenceRule();
    rule.second = 0;
    rule.minute = 0;
    schedule.scheduleJob(rule, function () {
      crawl.init(app);
    });
  })();
};


