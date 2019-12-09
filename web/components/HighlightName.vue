<template>
    <div>
        <el-tag size="mini" v-show="resolution"
                disable-transitions :type="getResolutionTagType(resolution)">
            {{resolution}}
        </el-tag>
        <browser-link class="page-items-magnet" :href="url" type="primary"
              v-html="highlight(keyword, value, 'highlight-name')"></browser-link>
    </div>
</template>

<script>

  import BrowserLink from './BrowserLink'
  export default {
    components: { BrowserLink },
    props: ['keyword', 'resolution', 'url', 'value'],
    methods: {
      getResolutionTagType (resolution) {
        if (resolution) {
          const regx = {
            '4K': 'primary',
            '2K': 'danger',
            '1080P': 'success'
          }
          for (let key in regx) {
            if (new RegExp(key, 'i').test(resolution)) {
              return regx[key]
            }
          }
          return 'info'
        }
      },
      /**
       * 点击磁力链
       */
      handleOpenMagnet (url) {
        window.open(url)
      }
    }
  }
</script>
<style lang="scss">
    .page-items-magnet {
        color: $--color-primary;
        cursor: pointer;

        .highlight-name {
            color: $--color-danger;
        }
    }
</style>
