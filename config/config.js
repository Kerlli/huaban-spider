const config = {
  'requestOptions': {
    url: `http://huaban.com/favorite/beauty/`,
    headers: {
      'Host': 'huaban.com',
      'Referer': 'http://huaban.com/favorite/beauty',
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.53 Safari/537.36',
      'X-Request': 'JSON',
      'X-Requested-With': 'XMLHttpRequest'
    },
    json: true
  },
  'crawlPicCount': 20,
  'distFolderName': 'downloads'
}

module.exports = { config }
