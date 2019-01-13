const rp = require('request-promise')
const { config } = require('./modules/config')
const { checkAndMkdirIfNeeded } = require('./modules/checkAndMkdirIfNeeded')
const { processResponse } = require('./modules/processResponse')
const { downloadFile } = require('./modules/downloadFile')

const { requestPromiseOptions, crawlPicCount, distFolderName } = config

// const requestUrl = 'http://huaban.com/favorite/beauty/'
/*
    首次请求用 http://huaban.com/favorite/beauty/
    之后使用 http://huaban.com/favorite/beauty/?max=${下个队列的首个pin_id}&wfl=1&limit=${一次要抓取的数量}
*/

rp(requestPromiseOptions)
    .then($ => {
        //process html to picUrls
        let { firstId, lastId, count, picUrls, filenames } = processResponse($('script').contents()[7])
        checkAndMkdirIfNeeded(distFolderName)
        downloadFile(picUrls, distFolderName, filenames)
    })
    .catch(err => {
        //Crawling failed or Cheerio choked
    })
