const fs = require('fs')
const { pathIsExist } = require('./pathIsExist')
const { pathIsAccessible } = require('./pathIsAccessible')

const checkAndMkdirIfNeeded = path => {
  if (pathIsExist(path) && pathIsAccessible(path)) {
      return
  } 
  if (!pathIsExist(path) && pathIsAccessible('.')) {
      fs.mkdirSync(path)
      return
  }
  if (!pathIsAccessible('.') || !pathIsAccessible(path)) {
      process.exit(1)
  }
}

module.exports = { checkAndMkdirIfNeeded }
