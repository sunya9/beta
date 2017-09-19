<template>
  <div>
    <app-header />
    <div class="container">
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