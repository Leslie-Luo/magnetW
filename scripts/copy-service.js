const {execSync} = require('child_process')
const {promisify} = require('util')
const path = require('path')
const fs = require('fs-extra')
const Terser = require('terser')
const ignore = ['.DS_Store', 'index.js', 'index.dev.js', 'ipc.js', 'node_modules']
const releases = 'build/releases/service'

const source = 'src/main'
const finder = require('findit2')(source)

fs.emptyDirSync(releases)

fs.copySync('service/index.js', `${releases}/index.js`)
fs.copySync('package.json', `${releases}/package.json`)
finder.on('file', function (file, stat, linkPath) {
  for (let i = 0; i < ignore.length; i++) {
    if (new RegExp(ignore[i]).test(file)) {
      console.info('忽略路径', file)
      return
    }
  }
  const target = file.replace(source, releases)
  const targetDir = path.join(target, '..')
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }
  if (/\.js$/.test(file)) {
    const result = Terser.minify(fs.readFileSync(file, 'utf-8'))
    fs.writeFileSync(target, result.code)
    console.info('压缩js', file)
  } else {
    fs.copySync(file, target)
    console.info('复制文件', file, target)
  }
})
/*

// execSync('cd web && npm run build', {stdio: 'inherit'})
fs.emptyDirSync(releases)
fs.copySync('web/dist', `${releases}/dist/web`)
fs.copySync('src/main', releases, {
  filter (name) {
    for (let i = 0; i < ignore.length; i++) {
      if (new RegExp(ignore[i]).test(name)) {
        return null
      }
    }
    return name
  }
})
fs.copySync('service/index.js', `${releases}/index.js`)
fs.copySync('package.json', `${releases}/package.json`)

*/
