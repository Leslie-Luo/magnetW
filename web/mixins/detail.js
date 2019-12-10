import axios from '~/plugins/axios'

export default {
  data () {
    return {
      detailCache: {}
    }
  },
  methods: {
    requestDetail (path) {
      axios.get('/detail', {
        params: { path }
      }).then((rsp) => {
        const detail = rsp.data
        if (detail) {
          this.detailCache['path'] = detail
        }
      }).catch((err) => {
        
      }).finally(() => {
        this.loading.table = false
      })
    }
  }
}
