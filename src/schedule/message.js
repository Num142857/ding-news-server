const puppeteer = require('puppeteer');
const fse = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const axios = require('axios')
const moment = require('moment')

module.exports = {
  async init() {
    try {
    var news = await fse.readJson(path.resolve(process.cwd(), '../news-data/data.json'))
    var exists = await fse.readJson(path.resolve(process.cwd(), '../news-data/exists.json'))

    //删除发送过的
    for (let index = news.length-1; index !=-1; index--) {
        const element = news[index];
        exists.forEach(exist => {
            if(exist.id == element.id){
                news.splice(index,1)
            }
        });
    }
    let messageData = news.splice(0,5)
    // messageData[0].picURL = 'http://img.mukewang.com/569dcb31000193fe07400411.jpg'
    messageData[0].picURL = `https://alili.tech/images/github_${parseInt(Math.random()*63)}.png`
    messageData[0].title = moment().format('hh:mm:ss') +" "+messageData[0].title
    
    console.log("开始发送信息")
    let data = {
      "feedCard": {
        "links": messageData
      },
      "msgtype": "feedCard"
    }
    const url = 'https://oapi.dingtalk.com/robot/send?access_token=2511b1d00f6021e5425a3e348bd54b8a158e34121650ca4f4401d0f40784fee8';
    const res = await axios.post(url,data);
    
    //已发送消息归档
    exists = exists.concat(messageData)
    
    await fse.writeJson(path.resolve(process.cwd(), '../news-data/data.json'), news)
    await fse.writeJson(path.resolve(process.cwd(), '../news-data/exists.json'), exists)
    console.log("还有这么多条没发",news.length)
    console.log("消息发送完毕")
      } catch (error) {
          console.log(error)
      }
  }
};
