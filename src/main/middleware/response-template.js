module.exports = async (ctx, next) => {
  try {
    ctx.success = function (data) {
      ctx.body = {
        success: true,
        data: data
      }
    }

    await next()

    if (ctx.status !== 200) {
      ctx.throw(ctx.status, ctx.message)
    }
  } catch (e) {
    console.error(e)
    ctx.status = e.statusCode || e.status || 500
    ctx.body = {
      success: false,
      message: e.message
    }
  }
}
