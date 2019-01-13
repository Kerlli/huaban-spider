const fs = require('fs')
const download = require('download')
const Promise = require('promise')
const rp = require('request-promise')
const { config } = require('./modules/config')

const { requestPromiseOptions, crawlPicCount, distFolderName } = config

// const requestUrl = 'http://huaban.com/favorite/beauty/'
/*
    首次请求用 http://huaban.com/favorite/beauty/
    之后使用 http://huaban.com/favorite/beauty/?max=${下个队列的首个pin_id}&wfl=1&limit=${一次要抓取的数量}
*/

const sliceString = (string, charHead, charTail) => 
    string.slice(
        string.indexOf(charHead) + charHead.length || 0
        , string.indexOf(charTail) || string.length - 1
    )

const getPicIdQueueInfo = responseJSON => {
    return {
        firstId: responseJSON[0].pin_id,
        lastId: responseJSON[responseJSON.length - 1].pin_id,
        count: responseJSON.length,
        picUrls: responseJSON
            .map(picInfo => `http://img.hb.aicdn.com/${picInfo.file.key}_/fw/480`),
        filenames: responseJSON
            .map(picInfo => `${picInfo.file.key}.jpg`)
    }
}

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
        let { data } = $('script').contents()[7]
        let responseJSON = JSON.parse(sliceString(data, 'app.page["pins"] = ', ';\napp.page["ads"]'))
        let { firstId, lastId, count, picUrls, filenames } = getPicIdQueueInfo(responseJSON)
        checkPathPermissions(distFolderName)
        downloadFile(picUrls, distFolderName, filenames)
    })
    .catch(err => {
        //Crawling failed or Cheerio choked
    })
