<template>
  <div style="margin-top">
    <app-header />
    <div class="container mt-5 pt-5">
      <nuxt />
    </div>
  </div>
</template>

<script>
import AppHeader from '~/components/Header'

export default {
  components: {
    AppHeader
  }
}
</script>
