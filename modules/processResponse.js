const { sliceString } = require('./sliceString')

const getPicIdQueueInfo = responseJSON => {
  return {
      firstId: responseJSON[0].pin_id,
      lastId: responseJSON[responseJSON.length - 1].pin_id,
      count: responseJSON.length,
      picUrls: responseJSON
          .map(picInfo => `http://img.hb.aicdn.com/${picInfo.file.key}_/fw/480`),
      filenames: responseJSON
          .map(picInfo => `${picInfo.file.key}.jpg`)
  }
}

const processResponse = ({ data = String }) => {
  let responseJSON = JSON.parse(sliceString(data, 'app.page["pins"] = ', ';\napp.page["ads"]'))
  return getPicIdQueueInfo(responseJSON)
}

module.exports = { processResponse }
