const download = require('download')
const Promise = require('promise')

const downloadFile =  (urlQueue, distPath, filenameQueue) => {
  Promise.all(urlQueue.map((f, i) => download(f, distPath, { filename: filenameQueue[i] }))).then(r => {
      console.log('Download Complete.')
  })
}

module.exports = { downloadFile }
