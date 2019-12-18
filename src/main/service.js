const defaultConfig = require('./defaultConfig')
const {start} = require('./api')

async function startServer () {
  let config
  try {
    const args = process.argv.splice(2)
    const configPath = args[0]
    if (configPath) {
      config = require(configPath)()
      console.info('使用自定义配置', config)
    }
  } catch (e) {
    console.error(e.message)
  }
  if (!config) {
    config = defaultConfig()
    console.info('使用默认配置', config)
  }

  const {port, ip, local, message} = await start(config)
  if (message) {
    console.error(message)
  } else {
    console.info(`启动成功，本地访问 http://${local}:${port}，IP访问 http://${ip}:${port}`)
  }
}

startServer()
