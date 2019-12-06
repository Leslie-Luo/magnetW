const format = require('./format-parser')
const URI = require('urijs')

// import { session } from 'electron'

const request = require('request-promise-native')
// const fs = require('fs')
const cacheManager = require('./node-cache')
const xpath = require('xpath')
const DOMParser = require('xmldom').DOMParser
const htmlparser2 = require('htmlparser2')
const domParser = new DOMParser({
  errorHandler: {
    warning: w => {
      // console.warn(w)
    },
    error: e => {
      // console.error(e)
    },
    fatalError: e => {
      // console.error(e)
    }
  }
})

let ruleMap = {}
const setting = require('./defaultSetting')()

function clearCache () {
  cacheManager.clear()
}

/**
 * 变换搜索参数
 * @param option
 * @param id
 * @param paths
 * @returns
 */
function transformSearchOption ({ option, id, paths }) {
  const keyword = option.keyword
  const page = !option.page || option.page < 1 ? 1 : option.page
  // 如果没有指定的排序 就取第一个排序
  let sort = option.sort
  if (!(option.sort in paths)) {
    for (let property in paths) {
      sort = property
      break
    }
  }
  const path = paths[sort].replace(/{k}/g, encodeURIComponent(keyword)).replace(/{p}/g, page)
  return { id, keyword, page, sort, path }
}

/**
 * 补齐搜索参数
 * @param rule
 * @param keyword
 * @param page
 * @param sort
 * @returns {{id: *, page: *, sort: *, keyword: *, url: *}}
 */
function makeupSearchOption ({ id, keyword, page, sort }) {
  const rule = getRuleById(id)

  const newPage = Math.max(1, page || null)
  // 如果没有指定的排序 就取第一个排序
  const pathKeys = Object.keys(rule.paths)
  const newSort = pathKeys.indexOf(sort) !== -1 ? sort : pathKeys[0]
  // 拼接完整url
  const url = rule.url + rule.paths[newSort].replace(/{k}/g, encodeURIComponent(keyword)).replace(/{p}/g, newPage)
  return { id: rule.id, keyword, page: newPage, sort: newSort, url }
}

function getRuleById (id) {
  return ruleMap[id] || ruleMap[Object.keys(ruleMap)[0]]
}

/**
 *
 * @param url 搜索的url 必选项
 * @param userAgent 必选项
 * @returns {{Origin: *, Referer: *, 'User-Agent': *, Host: *, 'Accept-Language': string}}
 */
function makeHeaders ({ url, userAgent }) {
  const uri = new URI(url)
  const host = uri.host()
  const origin = uri.origin()
  return {
    'Host': host,
    'Origin': origin,
    'Referer': origin,
    'Accept-Language': 'zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7,und;q=0.6,ja;q=0.5',
    'User-Agent': userAgent
  }
}

async function requestDocument ({ url, userAgent }) {
  const timeout = setting.timeout
  const proxyURL = setting.proxy && setting.proxy ? `http://${setting.proxyHost}:${setting.proxyPort}` : null

  const headers = makeHeaders({ url, userAgent })
  const html = await request({
    url: url,
    headers: headers,
    timeout: timeout,
    proxy: proxyURL
  })

  // 用htmlparser2转换一次再解析
  const outerHTML = htmlparser2.DomUtils.getOuterHTML(htmlparser2.parseDOM(html))
  return domParser.parseFromString(outerHTML)
}

async function obtainSearchResult ({ id, url, userAgent }) {
  const rule = getRuleById(id)

  // 如果没有缓存
  let items = cacheManager.get(url)
  if (!items || items.length <= 0) {
    // 去源站请求
    let document = await requestDocument({ url, userAgent })
    items = parseItemsDocument(document, rule.xpath)

    // 缓存请求到的列表
    cacheManager.set(url, items)
  }
  return items
}

/**
 * 缓存下一页和下一个源站
 * @param id
 * @param keyword
 * @param page
 * @param sort
 * @param userAgent
 */
function asyncCacheSearchResult ({ id, keyword, page, sort }, { userAgent }) {
  if (!setting.preload) {
    return
  }

  // 缓存下一页
  const next = makeupSearchOption({ id, keyword, page: page + 1, sort })
  obtainSearchResult({ id, url: next.url, userAgent })

  if (page === 1) {
    // 是第一页才缓存下一个源站
    let ruleKeys = Object.keys(ruleMap)
    const rule = ruleMap[ruleKeys[ruleKeys.indexOf(id) + 1]]
    if (rule) {
      const next = makeupSearchOption({ id: rule.id, keyword, page, sort })
      obtainSearchResult({ id: next.id, url: next.url, userAgent })
    }
  }
}

/**
 * 根据规则和参数构建请求
 * @param rule
 * @param searchOption
 * @param setting
 * @returns
 */
function buildRequest ({ rule, option, setting }) {
  const current = transformSearchOption({ option, id: rule.id, paths: rule.paths })

  const root = rule.url
  const url = root + current.path
  current['url'] = url

  const host = root.substr(root.indexOf('://') + 3)
  const headers = {
    'Host': host,
    'Origin': root,
    'Referer': root,
    'Accept-Language': 'zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7,und;q=0.6,ja;q=0.5'
  }
  // 如果要自定义UA
  // headers['User-Agent'] = setting.customUserAgent ? setting.customUserAgentValue : session.defaultSession.getUserAgent()
  const proxy = rule.proxy && setting.proxy ? `http://${setting.proxyHost}:${setting.proxyPort}` : null
  const requestOptions = {
    url: url,
    headers: headers,
    timeout: 10000,
    proxy: proxy
  }

  return { current, requestOptions }
}

/**
 * 解析列表Document
 * @param document
 * @param expression xpath表达式对象
 */
function parseItemsDocument (document, expression) {
  const items = []
  const groupNodes = xpath.select(expression.group, document)
  groupNodes.forEach((child, index) => {
    // 名称
    const nameNode = xpath.select(expression.name, child)
    const name = format.extractTextByNode(nameNode)
    // 分辨率
    const resolution = format.extractResolution(name)
    // 磁力链
    const magnet = format.extractMagnet(format.extractTextByNode(xpath.select(expression.magnet, child)))
    // 时间
    const date = format.extractDate(format.extractTextByNode(xpath.select(expression.date, child)))
    // 文件大小
    const size = format.extractFileSize(format.extractTextByNode(xpath.select(expression.size, child)))
    // 人气
    const hot = expression.hot ? format.extractNumber(format.extractTextByNode(xpath.select(expression.hot, child))) : null
    // 详情url
    const detailExps = expression.name + '/@href'
    const detailUrl = format.extractTextByNode(xpath.select(detailExps, child))
    if (name) {
      items.push({
        name, magnet, resolution, date, size, hot, detailUrl
      })
    }
  })
  // console.silly(`\n${JSON.stringify(items, '\t', 2)}`)
  return items
}

/**
 * 从网络或者本地更新并缓存规则
 * @param url
 * @returns {Promise<void>}
 */
async function loadRuleByURL (url) {
  let rule
  try {
    if (url.startsWith('http')) {
      // 如果是网络文件
      console.info('获取网络规则文件', url)
      rule = await request(url, { timeout: 8000, json: true })
    } else {
      console.info('读取本地规则文件', url)
      // rule = JSON.parse(fs.readFileSync(url))
    }
    if (!Array.isArray(rule) || rule.length <= 0) {
      throw new Error('规则格式不正确')
    }
    let log = ''
    rule.forEach(it => {
      log += `\n[加载][${it.name}][${it.url}]`
    })
    const proxyCount = rule.filter(it => it.proxy).length
    log += `\n${rule.length}个规则加载完成，其中${rule.length - proxyCount}个可直接使用，${proxyCount}个需要代理`
    console.info(log)

    cacheManager.set('rule_json', JSON.stringify(rule))
  } catch (e) {
    rule = require('./rule.json')
    console.error('缓存规则失败，将使用本地规则', e.message)
  }
  return rule
}

async function getRule () {
  let rule
  try {
    let ruleJson = cacheManager.get('rule_json')
    if (ruleJson) {
      // 如果有规则缓存 就使用缓存
      rule = JSON.parse(ruleJson)
    }
    if (!rule) {
      throw new Error('没有可用的规则缓存')
    }
    if (!Array.isArray(rule) || rule.length <= 0) {
      throw new Error('缓存规则格式不正确')
    }
    console.debug('使用缓存规则', rule)
  } catch (e) {
    rule = require('./rule.json')
    console.error('使用本地规则', e.message)
  }
  rule.forEach(it => {
    ruleMap[it.id] = it
  })
  return rule
}

/**
 * 请求源站搜索结果并解析搜索结果
 * @param url 已拼接好的url
 * @param xpath 规则xpath
 */
async function requestParseSearchItems ({ requestOptions, xpath }) {
  try {
    const rsp = await request(requestOptions)

    // 用htmlparser2转换一次再解析
    let outerHTML = htmlparser2.DomUtils.getOuterHTML(htmlparser2.parseDOM(rsp))
    const document = domParser.parseFromString(outerHTML)
    return { items: parseItemsDocument(document, xpath) }
  } catch (e) {
    console.error('解析失败', e)
    return { err: e }
  }
}

/**
 * 异步缓存搜索结果
 * @param current
 * @param setting
 * @returns
 */
async function asyncCacheSearchResult1 ({ current, setting }) {
  async function asyncRequest (option) {
    const rule = ruleMap[option.id]
    const { current, requestOptions } = buildRequest({ rule, option, setting })
    const key = requestOptions.url
    if (cacheManager.get(key)) {
      // 如果还有缓存 就不请求了
      return
    }
    console.info('构建预加载请求', requestOptions)
    const { err, items } = await requestParseSearchItems({ requestOptions, xpath: rule.xpath })
    if (items && items.length > 0) {
      // 存入缓存
      cacheManager.set(key, items, setting.cacheExpired)
    }
  }

  if (current.page === 1) {
    // 是第一页才缓存源站
    const option = JSON.parse(JSON.stringify(current))
    const keys = Object.keys(ruleMap)
    let nextIndex
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === option.id) {
        nextIndex = i + 1
        break
      }
    }
    if (nextIndex && nextIndex < keys.length) {
      option.id = ruleMap[keys[nextIndex]].id
    }
    asyncRequest(option)
  }

  // 缓存下一页
  const pageOption = JSON.parse(JSON.stringify(current))
  pageOption.page++
  asyncRequest(pageOption)
}

/**
 * 获取搜索结果
 * @param option 搜索的参数
 * @param setting
 * @param callback 回调
 * @returns
 */
async function obtainSearchResult1 (option, setting, callback) {
  if (!option.keyword) {
    const err = { message: '请输入要搜索的关键词' }
    callback(err)
    return
  }
  let startTime = Date.now()

  // 根据id找出具体规则
  const rule = ruleMap[option.id]

  const { current, requestOptions } = buildRequest({ rule, option, setting })
  console.info('发起搜索', requestOptions)

  // 缓存
  const key = requestOptions.url
  let items = cacheManager.get(key)
  let useCache = !!items

  let err = null
  if (!useCache) {
    // 不使用缓存 去请求
    const result = await requestParseSearchItems({ requestOptions, xpath: rule.xpath })
    err = result.err
    items = result.items
    if (items && items.length > 0) {
      // 存入缓存
      cacheManager.set(key, items, setting.cacheExpired)
    }
  }

  const time = Date.now() - startTime
  const res = { useCache, time }
  const data = { current, res, items }
  callback(err, data)

  // 异步预加载并缓存
  if (items && items.length > 0 && setting.preload) {
    asyncCacheSearchResult({ current, setting })
  }
}

module.exports = {
  loadRuleByURL,
  getRule,
  obtainSearchResult,
  clearCache,
  makeupSearchOption,
  makeHeaders,
  asyncCacheSearchResult
}
