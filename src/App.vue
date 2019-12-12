<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="scss">
  #app {
    height: 100%;
  }

  .el-main {
    padding: 0 !important;
  }

  .el-header {
    height: 80px !important;

    .header {
      height: 100%;
    }
  }

  .header-placeholder {
    height: 15px;
  }

  .title {
    font-size: 18px;
    color: $color-title;
  }

  .highlight-name {
    color: $--color-primary;
  }

  .align-items-center {
    display: flex;
    align-items: center;
  }

  .el-checkbox {
    font-weight: normal !important;
  }

  .el-header {
    border-bottom: 1px solid $color-border;
  }

  .scroll-container {
    height: 100%;

    .el-scrollbar {
      height: 100%;
    }

    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }

    .el-scrollbar__view {
      height: auto !important;
    }

  }
</style>
