<template>
  <el-link :type="type"
           :href="href"
           :target="target||'_blank'"
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
      'target': String,
      'icon': String
    },
    computed: {
      linkClass () {
        const linkClass = this.href ? 'browser-link' : 'browser-link browser-link-empty'
        return this.button ? `el-button el-button--default el-button--${this.size} browser-link-button` : linkClass
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

  .browser-link-button {
    vertical-align: baseline;
  }

  .browser-link-empty, .browser-link-empty:hover {
    color: $--color-text-primary;
    cursor: inherit;
  }
</style>
