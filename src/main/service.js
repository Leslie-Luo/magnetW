const processConfig = require('./process-config')
const {start} = require('./api')

async function startServer () {
  try {
    const args = process.argv.splice(2)
    const configPath = args[0]
    if (configPath) {
      processConfig.saveConfig(require(configPath)())
    }
  } catch (e) {
    console.error(e.message)
  }

  const {port, ip, local, message} = await start(processConfig.getConfig())
  if (message) {
    console.error(message)
  } else {
    console.info(`启动成功，本地访问 http://${local}:${port}，IP访问 http://${ip}:${port}`)
  }
}

startServer()
