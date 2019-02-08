<template>
  <nuxt-link
    v-if="ownDomain"
    v-bind="$attrs"
    :to="href"
  >
    <slot />
  </nuxt-link>
  <a
    v-else
    v-bind="$attrs"
    :href="href"
  >
    <slot />
  </a>
</template>
<script>
export default {
  props: {
    to: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    ownDomain() {
      return this.to.startsWith('https://beta.pnut.io')
    },
    href() {
      return this.to.replace(/^https:\/\/beta\.pnut\.io/, '')
    }
  }
}
</script>
