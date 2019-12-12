const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const prefix = '/api'
const router = new Router({ prefix })
const repo = require('./repository')

app.use(require('@koa/cors')())
app.use(require('koa-bodyparser')())
app.use(require('./middleware/block'))
app.use(require('./middleware/response-template'))
router.get('/rule', async (ctx) => {
  ctx.success(await repo.getRule())
})

router.get('/search', async (ctx) => {
  if (ctx.query.keyword) {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'

    const current = repo.makeupSearchOption(ctx.query)
    const items = await repo.obtainSearchResult(current, { userAgent: ua })
    ctx.success({
      current,
      items
    })

    // 异步缓存后续结果
    repo.asyncCacheSearchResult(current, { userAgent: ua })
  } else {
    ctx.throw(400, '请输入关键词')
  }
})

router.get('/detail', async (ctx) => {
  const id = ctx.query.id
  const path = ctx.query.path
  if (id && path) {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'

    const detail = await repo.obtainDetailResult({ id, path }, { userAgent: ua })
    ctx.success(detail)
  } else {
    ctx.throw(400, '请指定ID和URL')
  }
})

app.use(router.routes()).use(router.allowedMethods())

async function initialize () {
  await repo.getRule()
}

module.exports = {
  app, initialize, prefix
}
