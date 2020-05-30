<template>
  <div style="margin-top">
    <app-header />
    <div class="container mt-5 pt-5">
      <nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppHeader from '~/components/organisms/Header.vue'

export default Vue.extend({
  components: {
    AppHeader,
  },
})
</script>
