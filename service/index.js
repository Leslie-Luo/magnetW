const { app, initialize } = require('../service/api')

async function start () {
  await initialize()

  const port = parseInt(process.env.PORT || 3000)
  const server = app.listen(port, async () => {
    let host = server.address().address
    console.info('启动成功，访问地址为 http://%s:%s', host === '::' ? 'localhost' : host, port)
  })
}

start()
