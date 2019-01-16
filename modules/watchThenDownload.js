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
