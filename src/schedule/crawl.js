
const puppeteer = require('puppeteer');
var os = require('os');
const fse = require('fs-extra');
const path = require('path');
const _ = require('lodash');

module.exports = async function(app){
  await getArticle('https://juejin.im/welcome/frontend');
  await getArticle('https://juejin.im/tag/前端');
  await getArticle('https://juejin.im/tag/前端?sort=hottest');
  await getArticle('https://juejin.im/tag/JavaScript');
  await getArticle('https://juejin.im/tag/JavaScript?sort=hottest');
  await getArticle('https://juejin.im/tag/Node.js');
  await getArticle('https://juejin.im/tag/Node.js?sort=hottest');
  await getArticle('https://juejin.im/tag/react.js');
  await getArticle('https://juejin.im/tag/react.js?sort=hottest');
  await getArticle('https://juejin.im/tag/vue.js');
  await getArticle('https://juejin.im/tag/vue.js?sort=hottest');
  await getArticle('https://juejin.im/tag/Webpack');
  await getArticle('https://juejin.im/tag/Webpack?sort=hottest');
  await getArticle('https://juejin.im/tag/CSS');
  await getArticle('https://juejin.im/tag/CSS?sort=hottest');
  await getArticle('https://juejin.im/tag/前端框架');
  await getArticle('https://juejin.im/tag/前端框架?sort=hottest');
  await getArticle('https://juejin.im/tag/HTTP');
  await getArticle('https://juejin.im/tag/HTTP?sort=hottest');
  await getArticle('https://juejin.im/tag/React%20Native');
  await getArticle('https://juejin.im/tag/React%20Native?sort=hottest');
  await getArticle('https://juejin.im/tag/Nginx');
  await getArticle('https://juejin.im/tag/Nginx?sort=hottest');
};

function shuffle(arr) {
  console.log('开始打乱数组');
  console.time('本次打乱,耗时');
  arr.sort(() => Math.random() - 0.5);
  console.log('打乱完毕');
  console.timeEnd('本次打乱,耗时');
}
function getArticle(url){
  console.time('本次抓取,共花费了');
  return new Promise(async function (resolve,reject){
    try {
      console.log('开始抓取内容', url);
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox ', '--disable-setuid-sandbox ']
      });
      const page = await browser.newPage();
      const loadCount = 10;
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.waitFor(5000);
      //加载更多文章
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);
      await page.keyboard.press('End');
      await page.waitFor(1000);

      var result = await page.evaluate(() => {
        let arr = [];
        let newsList = document.querySelectorAll('.title-row');
        console.log(newsList);
        newsList.forEach((item) => {
          let title = item.querySelector('a').innerText;
          let messageURL = item.querySelector('a').href;
          arr.push({
            title,
            messageURL
          });
        });
        console.log(arr);
        return arr;
      });

      let newsDataPath = `${os.homedir()}/.news/`;
      let newsFilePath = `${os.homedir()}/.news/data.json`;
      let newsExistsPath = `${os.homedir()}/.news/exists.json`;
      const exists = await fse.pathExists(newsDataPath);
      if (exists) {
        console.log('文件已经存在,开始对已存在数据去重处理');
        const news = await fse.readJson(newsFilePath);
        result = result.concat(news);
        result = _.uniqBy(result, 'messageURL');
      } else {
        console.log('文件不存在,开始生成');
        await fse.ensureDir(newsDataPath);
        await fse.writeJson(newsExistsPath, []);

      }
      shuffle(result);
      await fse.writeJson(newsFilePath, result);
      console.log('抓取完毕,数据量为:', result.length);
      await browser.close();
      resolve('Done');
      console.timeEnd('本次抓取,共花费了');
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
  
}