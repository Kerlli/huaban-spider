const processResponse = responseJSON => {
  return {
      firstId: responseJSON[0].pin_id,
      lastId: responseJSON[responseJSON.length - 1].pin_id,
      count: responseJSON.length,
      picUrls: responseJSON
          .map(picInfo => `http://img.hb.aicdn.com/${picInfo.file.key}_.jpg/fw/480`),
      filenames: responseJSON
          .map(picInfo => `${picInfo.file.key}.jpg`)
  }
}

module.exports = { processResponse }
