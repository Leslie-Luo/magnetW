<template>
  <nuxt/>
</template>
<script>

  export default {}
</script>

<style lang="scss">
  #__nuxt, #__layout {
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
      margin: 0 !important;
    }

    .el-scrollbar__view {
      height: auto !important;
    }

  }

</style>
