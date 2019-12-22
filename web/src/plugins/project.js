import Vue from 'vue'

Vue.use({
    install: (Vue, options) => {
      const baseURL = 'https://magnetw.app'
      Vue.prototype.project = {
        baseURL: baseURL,
        icons: {
          baseUrl: `${baseURL}/favicon`,
          extension: 'ico'
        },
        searchPlaceholder: ['火影忍者', '钢铁侠', '美国队长', '犬夜叉', '七龙珠', '奥特曼', '千与千寻', '你的名字。'],
        proxyDocURL: `${baseURL}/guide/proxy.html`,
        checkUpdateURL: `${baseURL}/update.json`,
        guide: {
          content: [
          ]
        },
        menu: [
        ]
      }
    }
  }
)
