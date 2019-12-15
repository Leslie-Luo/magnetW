<template>
  <div class="logger">
    <div v-for="line in lines">
      {{line}}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      'lines': Array
    }
  }
</script>

<style scoped>
  .logger {
    color: #777;
    background-color: #f5f7fa;
    border-left: 1px solid #dcdfe6;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 14px;
    padding: 5px 10px;
  }
</style>
