<template>
  <el-row class="logo-header">
    <img src="../assets/logo.png" width="50" height="50"/>
    <div class="logo-header-text">
      <span>{{appName}}</span>
      <span class="logo-header-version">v{{version}}</span>
    </div>
  </el-row>
</template>

<script>
  import os from 'os'
  import {remote} from 'electron'

  export default {
    data () {
      return {
        platform: os.platform(),
        version: remote.app.getVersion(),
        appName: remote.app.getName()
      }
    },
    computed: {
      local () {
        return `http://${this.status.local}:${this.status.port}`
      },
      ip () {
        return `http://${this.status.ip}:${this.status.port}`
      }
    }
  }
</script>

<style scoped lang="scss">
  .logo-header {
    align-items: center;
    height: 100%;
    display: flex;
  }

  .logo-header-text {
    margin-left: 25px;
    font-size: 26px;
    color: $--color-primary;
  }

  .logo-header-version {
    margin-left: 5px;
    font-size: 20px;
    vertical-align: baseline;
  }
</style>
