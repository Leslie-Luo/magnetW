/* 此脚本用于编译web页面 */
const {execSync} = require('child_process')
const fs = require('fs-extra')

execSync('cd web && npm run build', {stdio: 'inherit'})

fs.emptyDirSync('./dist/web')
fs.copySync('./web/dist', './dist/web')
