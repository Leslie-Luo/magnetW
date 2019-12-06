const blacklist = ['googlebot', 'mediapartners-google', 'adsbot-google', 'baiduspider', '360spider', 'haosouspider', 'sosospider', 'sogou spider', 'sogou news spider', 'sogou web spider', 'sogou inst spider', 'sogou spider2', 'sogou blog', 'sogou orion spider', 'yodaobot', 'youdaobot', '360spider', 'bingbot', 'slurp', 'teoma', 'ia_archiver', 'twiceler', 'msnbot', 'scrubby', 'robozilla', 'gigabot', 'yahoo-mmcrawler', 'yahoo-blogs', 'yahoo! slurp china', 'yahoo!-adcrawler', 'psbot', 'yisouspider', 'easouspider', 'jikespider', 'etaospider', 'glutenfreepleasure']
const blacklistRegx = new RegExp(blacklist.join('|'), 'gi')
module.exports = async (ctx, next) => {
  const userAgent = ctx.headers['user-agent']
  if (blacklistRegx.test(userAgent)) {
    ctx.throw(404, '404')
  } else {
    await next()
  }
}
