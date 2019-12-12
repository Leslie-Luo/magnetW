const fs = require('fs-extra')
const config = require('../config')
const build = config.build.assetsRoot
fs.emptyDir(build)
  .then(() => {
    console.info('清空文件夹：', build)
  })
  .catch(err => {
    console.error(err)
  })
