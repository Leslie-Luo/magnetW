<template>
  <el-link :type="type"
           :href="href"
           :target="_blank?'_blank':'_self'"
           :underline="underline||false"
           :icon="icon"
           :class="buttonClass">
    <slot></slot>
  </el-link>
</template>

<script>

  export default {
    props: {
      'href': String,
      'underline': Boolean,
      'type': String,
      'button': Boolean,
      'size': String,
      '_blank': Boolean,
      'icon': String
    },
    computed: {
      buttonClass () {
        return this.button ? `el-button el-button--default el-button--${this.size}` : 'browser-link'
      }
    },
    methods: {
      handleClickLink () {
      }
    }
  }
</script>

<style scoped>
  .browser-link {
    font-size: inherit;
    font-weight: normal;
  }
</style>
