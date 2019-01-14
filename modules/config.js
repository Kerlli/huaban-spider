const cheerio = require('cheerio')

const config = {
  'requestPromiseOptions': {
    uri: `http://huaban.com/favorite/beauty/`,
    transform: function (body) {
        return cheerio.load(body)
    }
  },
  'crawlPicCount': 20,
  'distFolderName': 'downloads'
}

module.exports = { config }
