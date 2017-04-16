<template>
  <div id="wrapper">
    <app-header />
    <main class="container">
      <nuxt/>
    </main>
  </div>
</template>

<script>
import AppHeader from '~components/Header.vue'
import AppFooter from '~components/Footer.vue'
// import 'bootstrap-sass/assets/javascripts/bootstrap'
export default {
  components: {
    AppHeader
    // Footer
  }
}
</script>

<style>

</style>
