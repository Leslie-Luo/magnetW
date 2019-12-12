const middleware = async (ctx, next) => {
  const start = Date.now()

  await next()

  const ms = Date.now() - start

  const level = ctx.status === 200 ? 'debug' : 'warn'
  // logger[level]('[%s %dms] [%s] [%s] [%s]', ctx.status, ms, ctx.url, JSON.stringify(ctx.request.body), JSON.stringify(ctx.headers))
}

const error = (err) => {
  // logger.error(err)
}

module.exports = { middleware, error }
