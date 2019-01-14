const download = require('download')
const Promise = require('promise')

const downloadFile =  (urlQueue, crawlPicCount, distPath, filenameQueue) => {
  let downloadUrlQueue = urlQueue
  if (crawlPicCount && (crawlPicCount <= urlQueue.length)) {
    downloadUrlQueue = urlQueue.slice(0, crawlPicCount)
    console.log(`Preparing download ${crawlPicCount} images.`)
  }
  Promise.all(downloadUrlQueue.map((f, i) => download(f, distPath, { filename: filenameQueue[i] }))).then(r => {
      console.log('Download Complete.')
  })
}

module.exports = { downloadFile }
