// import fs from 'fs'

const {ipcMain, app} = require('electron')
const request = require('request-promise-native')
const {start, getServerInfo, stop} = require('./api')
const defaultConfig = require('./defaultConfig')
const Store = require('electron-store')
const store = new Store()

function saveConfig (newConfig) {
  const tempSettingVariable = {}
  let defaultSetting = defaultConfig()
  for (let key in newConfig) {
    // 如果不是默认配置 就保存
    if (newConfig.hasOwnProperty(key)) {
      const value = newConfig[key]
      if (value != null && value !== defaultSetting[key]) {
        tempSettingVariable[key] = value
      }
    }
  }
  // 如果修改了配置 就重新合并配置数据
  const isModified = Object.keys(tempSettingVariable).length > 0
  if (isModified) {
    let tempSetting = defaultConfig()
    Object.assign(tempSetting, tempSettingVariable)
  }
  isModified ? store.set('config_variable', tempSettingVariable) : store.delete('config_variable')
  console.info('保存修改配置', tempSettingVariable)
}

function getConfig () {
  let localSetting = defaultConfig()
  // 合并配置
  Object.assign(localSetting, store.get('config_variable'))
  return localSetting
}

async function registerIPC (mainWindow) {
  /**
   * 启动服务
   */
  ipcMain.on('start-server', async (event, config) => {
    saveConfig(config)
    event.sender.send('on-start-server', await start(getConfig()))
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
    event.sender.send('on-server-config', getConfig())
  })
  /**
   * 获取默认配置信息
   */
  ipcMain.on('get-default-server-config', async (event) => {
    event.sender.send('on-server-config', defaultConfig())
  })

  /**
   * 获取配置信息
   */
  ipcMain.on('check-update', async (event) => {
    try {
      const response = await request({
        url: defaultConfig().checkUpdateURL,
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
