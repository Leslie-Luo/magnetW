<template>
  <div>
    <qrcode-popover :text="item.magnet" :title="item.name" v-show="item.magnet">
      <browser-button :size="size" icon="iconfont icon-qrcode" class="popover-button">
        二维码
      </browser-button>
    </qrcode-popover>
    <browser-link :size="size" icon="el-icon-document"
                  :href="baseURL + item.detailUrl|formatURL"
                  :button="true"
                  :_blank="true">
      源站详情
    </browser-link>
    <browser-button :size="size" icon="el-icon-files"
                    v-show="!item.magnet"
                    type="primary"
                    plain
                    @click="handleClickDetail(item)">
      查看详情
    </browser-button>
    <browser-link :size="size" icon="iconfont icon-router"
                  :href="formatMiWiFiURL"
                  v-show="item.magnet"
                  :button="true"
                  :_blank="true">
      小米路由
    </browser-link>
    <browser-button :size="size" type="primary" plain icon="el-icon-copy-document"
                    v-show="item.magnet"
                    @click="handleCopyMagnet(item.magnet)">
      复制链接
    </browser-button>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64'
  import QrcodePopover from './QrcodePopover'
  import BrowserButton from './BrowserButton'
  import BrowserLink from './BrowserLink'

  export default {
    props: { 'baseURL': String, 'item': Object },
    components: {
      BrowserLink,
      BrowserButton,
      QrcodePopover
    },
    data () {
      return {
        size: 'mini'
      }
    },
    computed: {
      /**
       * 小米路由
       */
      formatMiWiFiURL () {
        const url = this.item.magnet
        return 'http://d.miwifi.com/d2r/?url=' + Base64.encodeURI(url)
      }
    },
    methods: {
      /**
       * 复制链接
       * @param url
       */
      handleCopyMagnet (url) {
        this.$copyText(url).then((e) => {
          this.$message({
            message: '复制成功',
            type: 'success'
          })
        })
      },
      /**
       * 详情
       * @param item
       */
      handleClickDetail (item) {
        this.$emit('show-detail', item)
      }
    }
  }
</script>
<style scoped lang="scss">
  .header-version {
    width: 180px;
  }

  .header-version-text {
    margin-left: 10px;
    color: $color-title;
    line-height: 1.3;
  }

  .popover-button {
    margin-right: 5px;
  }

  .el-button + .el-button {
    margin-left: 5px;
  }

  .el-button--mini {
    padding: 7px 10px;
  }
</style>
