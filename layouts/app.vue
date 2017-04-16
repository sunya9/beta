<template>
  <div id="wrapper">
    <app-header />
    <main class="container">
      <div class="row">
        <div class="col-sm-12 col-md-4">
          <sidebar />
        </div>
        <div class="col-sm-12 col-md-8">
          <nuxt />
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import AppHeader from '~components/Header'
import AppFooter from '~components/Footer'
import Sidebar from '~components/Sidebar'
export default {
  props: ['error'],
  components: {
    AppHeader,
    Sidebar
    // Footer
  }
}
</script>