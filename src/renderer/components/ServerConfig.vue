<template>
  <div class="config">
    <el-form ref="form" label-width="auto" label-position="left">
      <tooltip-form-item label="规则同步URL" tooltip="源站解析规则文件URL，支持网络链接和本地路径">
        <el-input :size="formSize" v-model="config.ruleUrl"></el-input>
      </tooltip-form-item>
      <el-form-item label="显示所有源站">
        <el-switch v-model="config.showProxyRule"></el-switch>
      </el-form-item>
      <el-form-item label="预加载">
        <el-switch v-model="config.preload"></el-switch>
      </el-form-item>
      <el-form-item label="缓存有效时间">
        <el-col :span="6">
          <el-input :size="formSize" v-model="config.cacheExpired" class="form-input-center">
            <template slot="append">秒</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="启用HTTP代理">
        <el-row>
          <el-col :span="4">
            <el-switch v-model="config.proxy"></el-switch>
          </el-col>
          <el-col :span="8">
            <el-input :size="formSize" v-model="config.proxyHost" class="form-input-center">
              <template slot="prepend">地址</template>
            </el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-input :size="formSize" v-model="config.proxyPort" class="form-input-center">
              <template slot="prepend">端口</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="自定义UserAgent">
        <el-switch v-model="config.customUserAgent"></el-switch>
        <el-input v-show="config.customUserAgent" type="textarea"
                  v-model="config.customUserAgentValue" placeholder="自定义UserAgent"
                  :size="formSize"></el-input>
      </el-form-item>
      <!--<el-form-item label="日志" class="form-input-center">
        <el-input disabled :size="formSize">
          <el-button slot="append" icon="el-icon-folder-opened"></el-button>
        </el-input>
      </el-form-item>-->
    </el-form>
    <div class="placeholder-disabled" v-show="starting"></div>
  </div>
</template>

<script>

  import TooltipFormItem from './TooltipFormItem'
  export default {
    components: {TooltipFormItem},
    props: {
      config: Object,
      starting: Boolean
    },
    data () {
      return {
        formSize: 'mini'
      }
    },
    methods: {},
    created () {
    }
  }
</script>

<style scoped lang="scss">
  .config {
    position: relative;
  }

  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  .form-input-center /deep/ input {
    text-align: center;
  }

  /deep/ .el-form-item__label-wrap {
    margin-left: 0 !important;
  }

  .placeholder-disabled {
    background-color: white;
    opacity: 0.7;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
