const fs = require('fs')
const download = require('download')
const Promise = require('promise')
const rp = require('request-promise')
const { config } = require('./modules/config')
const { processResponse } = require('./modules/processResponse')

const { requestPromiseOptions, crawlPicCount, distFolderName } = config

// const requestUrl = 'http://huaban.com/favorite/beauty/'
/*
    首次请求用 http://huaban.com/favorite/beauty/
    之后使用 http://huaban.com/favorite/beauty/?max=${下个队列的首个pin_id}&wfl=1&limit=${一次要抓取的数量}
*/

const pathAccessible = path => {
    let accessible = false
    try {
        fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
        accessible = true
    } catch (err) {
        console.error(`Access Directory ${path} Failed`)
    }
    return accessible
}

const pathExists = path => fs.existsSync(path)

const checkPathPermissions = path => {
    if (pathExists(path) && pathAccessible(path)) {
        return
    } 
    if (!pathExists(path) && pathAccessible('.')) {
        fs.mkdirSync(path)
        return
    }
    if (!pathAccessible('.') || !pathAccessible(path)) {
        process.exit(1)
    }
}

function downloadFile (urlQueue, distPath, filenameQueue) {
    Promise.all(urlQueue.map((f, i) => download(f, distPath, { filename: filenameQueue[i] }))).then(r => {
        console.log(r)
    })
}

rp(requestPromiseOptions)
    .then($ => {
        //process html to picUrls
        let { firstId, lastId, count, picUrls, filenames } = processResponse($('script').contents()[7])
        checkPathPermissions(distFolderName)
        downloadFile(picUrls, distFolderName, filenames)
    })
    .catch(err => {
        //Crawling failed or Cheerio choked
    })
