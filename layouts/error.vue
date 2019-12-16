<template>
  <div class="container text-center">
    <h1>{{ error.statusCode }}</h1>
    <p class="lead">
      {{ error.message }}
    </p>
    <nuxt-link
      v-if="error.statusCode"
      :to="error.home || '/'"
      class="btn btn-primary"
    >
      Top
    </nuxt-link>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { NuxtError } from '@nuxt/types'

export default Vue.extend({
  props: {
    error: {
      type: Object,
      required: true
    } as PropOptions<NuxtError>
  },
  layout: 'no-sidebar',
  head() {
    const title = this.error.statusCode ? this.error.statusCode.toString() : ''
    return {
      title
    }
  }
})
</script>
