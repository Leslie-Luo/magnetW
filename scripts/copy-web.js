const fs = require('fs-extra')
fs.emptyDirSync('./dist/web')
fs.copySync('./web/dist', './dist/web')
