// import fs from 'fs'

const {ipcMain} = require('electron')
const {start, getServerInfo, stop} = require('./api')
const defaultConfig = require('./defaultConfig')
const Store = require('electron-store')
const store = new Store()

async function registerIPC (mainWindow) {
  /**
   * 启动服务
   */
  ipcMain.on('start-server', async (event, config) => {
    const newConfig = defaultConfig()
    for (let key in newConfig) {
      if (config.hasOwnProperty(key) && config[key]) {
        newConfig[key] = config[key]
      }
    }
    store.set('config', newConfig)
    console.log(newConfig)
    event.sender.send('on-start-server', await start(newConfig))
  })
  /**
   * 停止服务
   */
  ipcMain.on('stop-server', (event) => {
    stop(() => {
      event.sender.send('on-stop-server')
    })
  })
  /**
   * 获取服务状态
   */
  ipcMain.on('get-server-info', async (event) => {
    event.sender.send('on-start-server', getServerInfo())
  })
  /**
   * 获取配置信息
   */
  ipcMain.on('get-server-config', async (event) => {
    let config = store.get('config')
    try {
      if (config) {
        console.info('使用缓存配置', config)
      }
    } catch (e) {
    }
    if (!config) {
      config = defaultConfig()
      console.info('使用默认配置', config)
    }
    event.sender.send('on-server-config', config)
  })
}

module.exports = registerIPC
