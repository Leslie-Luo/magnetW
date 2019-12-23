// import fs from 'fs'

const {ipcMain, app} = require('electron')
const request = require('request-promise-native')
const {start, getServerInfo, stop} = require('./api')
const processConfig = require('./process-config')
const Store = require('electron-store')
const store = new Store()


async function registerIPC (mainWindow) {
  /**
   * 启动服务
   */
  ipcMain.on('start-server', async (event, config) => {
    processConfig.saveConfig(config)
    event.sender.send('on-start-server', await start(processConfig.getConfig()))
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
    event.sender.send('on-server-config', processConfig.getConfig())
  })
  /**
   * 获取默认配置信息
   */
  ipcMain.on('get-default-server-config', async (event) => {
    event.sender.send('on-server-config', processConfig.defaultConfig())
  })

  /**
   * 获取配置信息
   */
  ipcMain.on('check-update', async (event) => {
    try {
      const response = await request({
        url: processConfig.defaultConfig().checkUpdateURL,
        json: true
      })
      let newVerArray = response.version.split('.')
      let currentVerArray = app.getVersion().split('.')
      for (let i = 0; i < newVerArray.length; i++) {
        if (parseInt(newVerArray[i]) > parseInt(currentVerArray[i])) {
          event.sender.send('new-version', response)
          return
        }
      }
      console.info('暂无更新', response.version)
    } catch (e) {
      console.error(e.message)
    }
  })
}

module.exports = registerIPC
