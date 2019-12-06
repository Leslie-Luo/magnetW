<template>
    <div class="header-version align-items-center">
        <img src="../assets/images/logo.png" height="36"/>
        <div>
            <div class="header-version-text">{{ appName }}</div>
            <div class="header-version-text">v{{ version }}</div>
        </div>
    </div>
</template>

<script>
  import os from 'os'
  // import { remote } from 'electron'

  export default {
    data () {
      return {
        platform: os.platform(),
        version: '111',
        appName: '111'
      }
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
    }
</style>
