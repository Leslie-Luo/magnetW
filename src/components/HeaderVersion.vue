<template>
  <browser-link href="/">
    <div class="header-version align-items-center">
      <img src="/logo.png" height="36"/>
      <div>
        <div class="header-version-text">{{ appName }}</div>
        <div class="header-version-text">v{{ version }}</div>
      </div>
    </div>
  </browser-link>
</template>

<script>

  import BrowserLink from './BrowserLink'

  export default {
    components: { BrowserLink },
    data () {
      return {
        version: this.$app.version,
        appName: this.$app.appName
      }
    },
    created () {

    }

  }
</script>
<style lang="scss">
  .header-version {

  }

  .header-version-text {
    margin-left: 10px;
    color: $color-title;
    line-height: 1.3;
    font-size: 16px;
  }
</style>
