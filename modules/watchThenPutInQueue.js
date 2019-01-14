const rp = require('request-promise')

const generateUrl = lastId => {
  let now = Date.now() + 1
  return `http://huaban.com/favorite/beauty/?fetch&${now.toString(36)}&since={lastId}&limit=100&wfl=1`
}

const options = {
  headers: {
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW,q=0.7',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.53 Safari/537.36',
    'X-Request': 'JSON',
    'X-Requested-With': 'XMLHttpRequest'
  },
  json: true
}

const watch = lastId => {
  rp(options.append('uri', generateUrl(lastId)))
  .then(pins => {
    console.log(pins || 'none')
  })
  .catch(err => {
      
  })
}

const watchThenPutInQueue = lastId => {
  let queue = []
  let interval = 2 * 60 * 1000
  setInterval(watch(lastId), interval)
}

module.exports = { watchThenPutInQueue }
