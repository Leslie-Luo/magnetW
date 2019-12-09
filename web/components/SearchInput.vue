<template>
  <div class="search-input">
    <el-input :placeholder="project.searchPlaceholder"
              @keyup.enter.native="emitClickSearch"
              v-model="value"
              clearable
              size="medium">
      <span slot="prepend">{{name}}</span>
      <el-button slot="append" icon="el-icon-search" @click="emitClickSearch">搜索</el-button>
    </el-input>
  </div>
</template>

<script>
  export default {
    props: ['name', 'keyword'],
    data () {
      return {
        value: null
      }
    },
    methods: {
      emitClickSearch () {
        this.$emit('search', this.value || this.project.searchPlaceholder)
      }
    },
    created () {
      this.value = this.keyword
    },
    mounted () {
    }
  }
</script>
