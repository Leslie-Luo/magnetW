const defaultConfig = require('./defaultConfig')

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

module.exports = {
  defaultConfig,
  saveConfig,
  getConfig
}
