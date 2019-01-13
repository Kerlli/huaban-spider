const fs = require('fs')

const pathIsAccessible = path => {
  let accessible = false
  try {
      fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
      accessible = true
  } catch (err) {
      console.error(`Access Directory ${path} Failed`)
  }
  return accessible
}

module.exports = { pathIsAccessible }
