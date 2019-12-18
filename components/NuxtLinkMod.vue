<template>
  <nuxt-link v-if="ownDomain" v-bind="$attrs" :to="href">
    <slot />
  </nuxt-link>
  <a v-else v-bind="$attrs" :href="href">
    <slot />
  </a>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    to: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    ownDomain(): boolean {
      return this.to.startsWith('https://beta.pnut.io')
    },
    href(): string {
      return this.to.replace(/^https:\/\/beta\.pnut\.io/, '')
    }
  }
})
</script>
