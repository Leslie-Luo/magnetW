<template>
  <!--页码-->
  <el-pagination
    @current-change="$emit('change', value)"
    :current-page="value"
    background
    layout="prev, pager, next"
    :pager-count="5"
    :page-count="50">
  </el-pagination>
</template>

<script>
  import BrowserLink from './BrowserLink'

  export default {
    props: {
      page: Number
    },
    components: {
      BrowserLink
    },
    data () {
      return {
        value: this.page
      }
    },
    created () {
    }
  }
</script>

<style lang="scss" scoped>

  .el-pagination {
    padding-right: 0 !important;

    /deep/ .number:last-child {
      display: none;
    }

    /deep/ .btn-next {
      margin-right: 0 !important;
    }
  }

</style>
