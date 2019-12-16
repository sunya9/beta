<template>
  <div style="margin-top">
    <app-header />
    <div class="container mt-5 pt-5">
      <nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import AppHeader from '~/components/Header.vue'

export default {
  components: {
    AppHeader
  }
}
</script>
