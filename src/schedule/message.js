const puppeteer = require('puppeteer');
const fse = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');
var os = require('os');
let newsFilePath = `${os.homedir()}/.news/data.json`;
let newsExistsPath = `${os.homedir()}/.news/exists.json`;
module.exports = async function (app) {
  try {
    var news = await fse.readJson(newsFilePath);
    var exists = await fse.readJson(newsExistsPath);

    //删除发送过的
    for (let index = news.length - 1; index != -1; index--) {
      const element = news[index];
      exists.forEach(exist => {
        if (exist.messageURL == element.messageURL) {
          news.splice(index, 1);
        }
      });
    }
    let messageData = news.splice(0, 8);
    // messageData[0].picURL = 'http://img.mukewang.com/569dcb31000193fe07400411.jpg'
    // messageData[0].title = moment().format('hh:mm:ss') +' '+messageData[0].title;
    messageData[0].picURL = `https://static.alili.tech/images/github_${Math.ceil(Math.random() * 63) }.png`;

    console.log('开始发送信息');
    let data = {
      'feedCard': {
        'links': messageData
      },
      'msgtype': 'feedCard'
    };
    const url = app.get('frontendRobot');
    const res = await axios.post(url, data);

    //已发送消息归档
    exists = exists.concat(messageData);

    await fse.writeJson(newsFilePath, news);
    await fse.writeJson(newsExistsPath, exists);
    console.log('还有这么多条没发', news.length);
    console.log('消息发送完毕');
  } catch (error) {
    console.log(error);
  }
};
