const fs = require('fs')

const pathIsExist = path => fs.existsSync(path)

module.exports = { pathIsExist }