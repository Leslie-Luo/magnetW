export default {
  methods: {
    formatURL (url) {
      const regexp = new RegExp(`http|${this.project.baseURL}`)
      if (regexp.test(url)) {
        const params = 'from=mw'
        const symbol = url.indexOf('?') !== -1 ? '&' : '?'
        return url + symbol + params
      } else {
        return url
      }
    }
  }
}
