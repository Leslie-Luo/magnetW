<template>
  <div class="server-status">
    <el-row v-if="status">
      <el-col :span="6">
        <span class="server-status-starting">服务已启动</span>
      </el-col>
      <el-col :span="8">
        <el-tag type="success" size="mini">本地</el-tag>
        <browser-link :href="local" type="primary">{{local}}</browser-link>
      </el-col>
      <el-col :span="10">
        <el-tag type="success" size="mini">IP</el-tag>
        <browser-link :href="ip" type="primary">{{ip}}</browser-link>
      </el-col>
    </el-row>
    <div v-else class="server-status-stopped">
      服务未启动
    </div>
  </div>
</template>

<script>
  import BrowserLink from './BrowserLink'

  export default {
    components: {BrowserLink},
    props: {
      status: Object
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
  .server-status {
  }

  .server-status-starting {
    color: $--color-success;
  }

  .server-status-stopped {
    color: $--color-danger;
  }
  .server-status-label{
    background-color: $--color-success-lighter;
    color: white;
  }
</style>
