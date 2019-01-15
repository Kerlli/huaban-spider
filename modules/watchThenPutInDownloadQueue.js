const rp = require('request-promise')
const cheerio = require('cheerio')
const { sleep } = require('sleep')
const get = require('simple-get')
const { config } = require('./config')
const { processResponse } = require('./processResponse')
const { checkAndMkdirIfNeeded } = require('./checkAndMkdirIfNeeded')
const { downloadFile } = require('./downloadFile')

const { crawlPicCount, distFolderName } = config

const generateUrl = lastId => {
  let now = Date.now() + 1
  return `http://huaban.com/favorite/beauty/?fetch&${now.toString(36)}&since=${lastId}&limit=100&wfl=1`
}

const options = {
  headers: {
    'Host': 'huaban.com',
    'Referer': 'http://huaban.com/favorite/beauty',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.53 Safari/537.36',
    'X-Request': 'JSON',
    'X-Requested-With': 'XMLHttpRequest'
  },
  json: true
}

const throttleDownloadQueue = (urlQueue, filenames, limit = crawlPicCount) => {
  let { length } = urlQueue
  length && checkAndMkdirIfNeeded(distFolderName)
  if (length && length <= 20) {
    downloadFile(urlQueue, crawlPicCount, distFolderName, filenames)
  }
  if (length && length > 20) {

  }
}

const watchAndDownload = lastId => {
  get.concat({url: generateUrl(lastId), ...options}, function (err, res, data) {
    if (err) throw err
    console.log(data)
  })
}

const watchThenPutInDownloadQueue = lastId => {
  let interval = 2 * 60 * 1000
  setInterval(watchAndDownload(lastId), interval)
}

module.exports = { watchAndDownload }
