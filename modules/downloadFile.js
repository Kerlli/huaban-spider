const download = require('download')
const Promise = require('promise')
const { pathIsExist } = require('./pathIsExist')

const downloadFile =  (urlQueue, crawlPicCount, distPath, filenameQueue) => {
  let downloadUrlQueue = urlQueue
  if (crawlPicCount && (crawlPicCount < urlQueue.length)) {
    downloadUrlQueue = urlQueue.slice(0, crawlPicCount)
    console.log(`Preparing download ${crawlPicCount} images.`)
  }
  let downloadQueue = filenameQueue.map((filename, i) => {
    if (pathIsExist(`${distPath}/${filename}`)) {
      console.log(`Skipping file "${filename}"`)
      return
    }
    return downloadUrlQueue[i]
  })
  Promise.all(downloadQueue.map((f, i) => download(f, distPath, { filename: filenameQueue[i] }))).then(r => {
      console.log('Download Complete.')
  })
}

module.exports = { downloadFile }
