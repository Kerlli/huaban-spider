const get = require('simple-get')
const { config } = require('./config/config')
const { checkAndMkdirIfNeeded } = require('./modules/checkAndMkdirIfNeeded')
const { processResponse } = require('./modules/processResponse')
const { downloadFile } = require('./modules/downloadFile')
const { watchAndDownload } = require('./modules/watchThenPutInDownloadQueue')

const { requestOptions, crawlPicCount, distFolderName } = config

get.concat(requestOptions, (err, res, data) => {
    if (err) throw err
    let { firstId, lastId, count, picUrls, filenames } = processResponse(data.pins)
    checkAndMkdirIfNeeded(distFolderName)
    downloadFile(picUrls, crawlPicCount, distFolderName, filenames)
    // watchAndDownload(lastId)
  })
