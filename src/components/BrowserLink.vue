<template>
  <el-link :type="type"
           :href="href"
           :target="_blank?'_blank':'_self'"
           :underline="underline||false"
           :icon="icon"
           :class="linkClass">
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
      linkClass () {
        const linkClass = this.href ? 'browser-link' : 'browser-link browser-link-empty'
        return this.button ? `el-button el-button--default el-button--${this.size}` : linkClass
      }
    },
    methods: {
      handleClickLink () {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .browser-link {
    font-size: inherit;
    font-weight: normal;
  }

  .browser-link-empty, .browser-link-empty:hover {
    color: $--color-text-primary;
  }
</style>
