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
            <el-row class="server-config-info">
                <el-col :span="12">
                    <h2>配置</h2>
                </el-col>
                <el-col :span="12" class="server-config-right">
                    <el-button size="mini" type="info" plain @click="handleResetConfig">重置</el-button>
                </el-col>
            </el-row>
            <server-config v-if="config"
                           :config="config"
                           :starting="serverStatus!=null"></server-config>
        </el-main>
    </el-container>
</template>

<script>
  import {ipcRenderer, remote, shell} from 'electron'
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
      },
      handleResetConfig () {
        ipcRenderer.send('get-default-server-config')
      },
      /**
       * 检查更新
       */
      checkUpdate () {
        this.$http.get(this.$config.checkUpdateURL)
          .then(response => {
            let newVerArray = response.data.version.split('.')
            let currentVerArray = remote.app.getVersion().split('.')
            for (let i = 0; i < newVerArray.length; i++) {
              if (parseInt(newVerArray[i]) > parseInt(currentVerArray[i])) {
                this.$confirm(response.data.content, `有新版本 v${response.data.version}`, {
                  confirmButtonText: '去更新',
                  cancelButtonText: '取消',
                  dangerouslyUseHTMLString: true
                }).then(() => {
                  shell.openExternal(response.data.url)
                }).catch(() => {
                })
                break
              }
            }
            console.info('暂无更新', response.data.version)
          })
          .catch(error => {
            console.error('检查更新失败', error)
          })
      }
    },
    created () {
      // 加载配置信息
      ipcRenderer.on('on-server-config', (event, config) => {
        this.loading.full = false
        this.config = config
      })

      // 服务操作
      ipcRenderer.on('on-start-server', (event, status) => {
        this.loading.starting = false
        if (status && status.message) {
          this.$message({
            message: status.message,
            type: 'error'
          })
        } else {
          this.serverStatus = status
        }
      })
      /**
       * 停止服务
       */
      ipcRenderer.on('on-stop-server', (event) => {
        this.loading.stopping = false
        this.serverStatus = null
      })

      /**
       * 有新版本
       */
      ipcRenderer.on('new-version', (event, data) => {
        this.$confirm(data.content, `有新版本 v${data.version}`, {
          confirmButtonText: '去更新',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true
        }).then(() => {
          shell.openExternal(data.url)
        }).catch(() => {
        })
      })

      // 获取服务配置
      this.loading.full = true
      ipcRenderer.send('get-server-config')

      // 获取服务状态
      ipcRenderer.send('get-server-info')

      // 检查更新
      ipcRenderer.send('check-update')
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

    .server-config-info {
        display: flex;
        align-items: center;
    }

    .server-config-right {
        text-align: right;
    }
</style>
