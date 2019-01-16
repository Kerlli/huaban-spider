const sleep = require('sleep')
const { checkAndMkdirIfNeeded } = require('./checkAndMkdirIfNeeded')
const { downloadFile } = require('./downloadFile')

const throttleDownloadQueue = (urlQueue, filenames, limit = crawlPicCount) => {
  let { length } = urlQueue
  length && checkAndMkdirIfNeeded(distFolderName)
  if (length && length <= 20) {
    downloadFile(urlQueue, crawlPicCount, distFolderName, filenames)
  }
  if (length && length > 20) {
    let groupCount = Math.ceil(length / 20)
    let sleepCount = groupCount - 1
    let groups = []
    for (let i = 0; i < groupCount; i++) {
      let startIndex = 20 * i
      let endIndex = 20 * (i + 1)
      groups.push(urlQueue.slice(startIndex, endIndex))
    }
    for (let count = 0; count < sleepCount; count++) {
      console.log(`download queue ${count + 1} start, next queue will start after 1 minutes.`)
      downloadFile(groups[count], limit, distFolderName, filenames)
      sleep.sleep(60)
    }
  }
}

module.exports = { throttleDownloadQueue }
