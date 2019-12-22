<template>
    <el-container>
        <el-header class="drag">
            <logo-header></logo-header>
        </el-header>
        <el-main v-loading="loading.full">
            <h2>状态</h2>
            <div class="server-action">
                <server-status
                        :status="serverStatus">
                </server-status>
                <el-button
                        v-show="!serverStatus"
                        @click="handleStartServer"
                        size="mini"
                        :loading="loading.starting"
                        type="primary" plain>启动服务
                </el-button>
                <el-button v-show="serverStatus"
                           :loading="loading.stopping"
                           @click="handleStopServer" size="mini"
                           type="danger" plain>停止服务
                </el-button>
            </div>
            <h2>配置</h2>
            <server-config v-if="config"
                           :config="config"
                           :starting="serverStatus!=null"></server-config>
        </el-main>
    </el-container>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import ServerStatus from '../components/ServerStatus'
  import ServerConfig from '../components/ServerConfig'
  import LogoHeader from '../components/LogoHeader'

  export default {
    components: {LogoHeader, ServerConfig, ServerStatus},
    data () {
      return {
        serverStatus: null,
        logs: [],
        config: null,
        loading: {
          full: false,
          starting: false,
          stopping: false
        }
      }
    },
    methods: {
      handleStartServer () {
        this.loading.starting = true
        ipcRenderer.send('start-server', this.config)
      },
      handleStopServer () {
        this.loading.stopping = true
        ipcRenderer.send('stop-server')
      }
    },
    created () {
      // 加载配置信息
      ipcRenderer.on('on-server-config', (event, config) => {
        this.loading.full = false
        this.config = config
      })
      this.loading.full = true
      ipcRenderer.send('get-server-config')

      // 服务操作
      ipcRenderer.on('on-start-server', (event, status) => {
        this.loading.starting = false
        if (status.message) {
          this.$message({
            message: status.message,
            type: 'error'
          })
        } else {
          this.serverStatus = status
        }
      })
      ipcRenderer.on('on-stop-server', (event) => {
        this.loading.stopping = false
        this.serverStatus = null
      })
      ipcRenderer.send('get-server-info')
    }
  }
</script>

<style lang="scss" scoped>
    .el-main {
        padding-top: 0;
        height: 100%;
    }

    .el-header {
        margin-top: 20px;
    }

    .server-action {
        display: flex;
        align-items: center;

        .server-status {
            flex: 1;
        }
    }
</style>
