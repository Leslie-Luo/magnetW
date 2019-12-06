const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router({ prefix: '/api' })
const path = require('path')
const koaStatic = require('koa-static')
const repo = require('./repository')

app.use(require('@koa/cors')())
app.use(require('koa-bodyparser')())
app.use(require('./middleware/block'))
app.use(require('./middleware/response-template'))

app.use(koaStatic(
  path.join('./dist/web')
))

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

app.use(router.routes()).use(router.allowedMethods())

const port = parseInt(process.env.PORT || 8000)
const server = app.listen(port, async () => {
  await repo.getRule()
  let host = server.address().address
  console.info('启动成功，访问地址为 http://%s:%s', host === '::' ? 'localhost' : host, port)
})
