<template>
  <el-link :type="type" :href="formatHref" :underline="underline||false" :class="formatClass">
    <slot></slot>
  </el-link>
</template>

<script>
  import mixin from '../mixins/mixin'

  export default {
    props: ['href', 'underline', 'type', 'button', 'size'],
    mixins: [mixin],
    computed: {
      formatHref () {
        return this.href ? this.formatURL(this.href) : this.href
      },
      formatClass () {
        return this.button ? `el-button el-button--default el-button--${this.size}` : ''
      }
    },
    methods: {
      handleClickLink () {
        window.open(this.formatHref())
      }
    }
  }
</script>

<style scoped>
  .el-link {
    font-weight: normal;
    vertical-align: baseline;
  }
</style>
