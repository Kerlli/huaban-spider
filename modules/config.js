const cheerio = require('cheerio')

const config = {
  'requestPromiseOptions': {
    uri: `http://huaban.com/favorite/beauty/`,
    transform: function (body) {
        return cheerio.load(body)
    }
  },
  'crawlPicCount': 5,
  'distFolderName': 'downloads'
}

module.exports = { config }
