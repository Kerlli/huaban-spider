const download = require('download')
const Promise = require('promise')
const { pathIsExist } = require('./pathIsExist')

const downloadFile =  (urlQueue, crawlPicCount, distPath, filenameQueue) => {
  let downloadUrlQueue = urlQueue, downloadQueue = []
  if (crawlPicCount && (crawlPicCount < urlQueue.length)) {
    downloadUrlQueue = urlQueue.slice(0, crawlPicCount)
    console.log(`Preparing download ${crawlPicCount} images.`)
  }
  filenameQueue.map((filename, i) => {
    if (pathIsExist(`${distPath}/${filename}`)) {
      console.log(`Skipping file "${filename}"`)
      return
    }
    downloadQueue.push(downloadUrlQueue[i])
  })
  if (!downloadQueue.length) return;
  Promise.all(downloadQueue.map((f, i) => download(f, distPath, { filename: filenameQueue[i] }))).then(r => {
      console.log('Download Complete.')
  })
}

module.exports = { downloadFile }
