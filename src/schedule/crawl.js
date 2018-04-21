const puppeteer = require('puppeteer');

const fse = require('fs-extra')
const path = require('path')
const _ = require('lodash')
module.exports = {
  async init() {
    try {
        console.log('开始抓取内容')
        const browser = await puppeteer.launch({
          headless: false
        });
        const page = await browser.newPage();
        const loadCount = 10
        await page.goto('https://segmentfault.com/frontend');
        await page.setViewport({
          width: 1920,
          height: 1080
        });
    
        await page.waitFor(1000);
        //加载更多文章
        await page.keyboard.press('End')
        await page.waitFor(1000);
        await page.keyboard.press('End')
        await page.waitFor(1000);
        await page.keyboard.press('End')
        await page.waitFor(1000);
        await page.click('#btn-load-more');
        await page.keyboard.press('End')
        await page.waitFor(1000);
        await page.keyboard.press('End')
        await page.waitFor(1000);
        await page.keyboard.press('End')
        await page.waitFor(1000);
        await page.click('#btn-load-more');

        var result = await page.evaluate(() => {
          let arr = [];
          let newsList = document.querySelectorAll('.news-item')
          newsList.forEach((item) => {
            let id = item.getAttribute('data-id')
            let title = item.querySelector('.news__item-title a').innerText;
            let messageURL = item.querySelector('.news__item-title a').href;
            arr.push({
              id,
              title,
              messageURL
            })
          })
          return arr
        });
        
    
        const exists = await fse.pathExists(path.resolve(process.cwd(), '../news-data/data.json'))

        if(exists){
          console.log('文件已经存在,开始对已存在数据去重处理')
            const news = await fse.readJson(path.resolve(process.cwd(), '../news-data/data.json'))
            result = result.concat(news)
            result = _.uniqBy(result,'id')
        }else{
            console.log('文件不存在,开始生成')
            await fse.ensureDir(path.resolve(process.cwd(), '../news-data/'))
            await fse.writeJson(path.resolve(process.cwd(), '../news-data/exists.json'), [])
            
        }
        
        await fse.writeJson(path.resolve(process.cwd(), '../news-data/data.json'), result)
        console.log("抓取完毕,数据量为:",result.length)
        await browser.close();
      } catch (error) {
        console.log(error)
      }
  }
};