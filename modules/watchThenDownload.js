const sleep = require('sleep')
const get = require('simple-get')
const { config } = require('../config/config')
const { checkAndMkdirIfNeeded } = require('./checkAndMkdirIfNeeded')
const { downloadFile } = require('./downloadFile')
const { processResponse } = require('./processResponse')

const { crawlPicCount, distFolderName, requestOptions } = config

const generateUrl = lastId => {
  let now = Date.now() + 1
  return `http://huaban.com/favorite/beauty/?fetch&${now.toString(36)}&since=${lastId}&limit=100&wfl=1`
}

// const throttleDownloadQueue = (urlQueue, filenames, limit = crawlPicCount) => {
//   let { length } = urlQueue
//   length && checkAndMkdirIfNeeded(distFolderName)
//   if (length && length <= 20) {
//     downloadFile(urlQueue, crawlPicCount, distFolderName, filenames)
//   }
//   if (length && length > 20) {
//     let groupCount = Math.ceil(length / 20)
//     let sleepCount = groupCount - 1
//     let groups = []
//     for (let i = 0; i < groupCount; i++) {
//       let startIndex = 20 * i
//       let endIndex = 20 * (i + 1)
//       groups.push(urlQueue.slice(startIndex, endIndex))
//     }
//     for (let count = 0; count < sleepCount; count++) {
//       console.log(`download queue ${count + 1} start, next queue will start after 1 minutes.`)
//       downloadFile(groups[count], limit, distFolderName, filenames)
//       sleep.sleep(60)
//     }
//   }
// }

const watchThenDownload = lastId => {
  let interval = 2 * 60 * 1000
  setInterval(() => {
    get.concat({...requestOptions, url: generateUrl(lastId)}, (err, res, data) => {
      if (err) throw err
      if (!data.pins.length) {
        console.log('No new pics found, will check serveral minutes later')
      }
      if (data.pins.length) {
        let { picUrls, filenames } = processResponse(data.pins)
        checkAndMkdirIfNeeded(distFolderName)
        downloadFile(picUrls, crawlPicCount, distFolderName, filenames)
      }
    })
  }, interval)
}

module.exports = { watchThenDownload }
