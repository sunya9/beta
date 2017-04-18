<template>
  <div id="wrapper">
    <app-header />
    <main class="container">
      <div class="row" v-if="user">
        <div class="hidden-sm-down col-md-4 col-lg-3">
          <sidebar class="fixed-top sticky-top" style="top: 70px" />
        </div>
        <div class="col-sm-12 col-md-8 col-lg-9">
          <nuxt />
        </div>
      </div>
      <div v-else>
        <nuxt />
      </div>
    </main>
  </div>
</template>
<script>
import AppHeader from '~components/Header'
import AppFooter from '~components/Footer'
import Sidebar from '~components/Sidebar'
import { mapState } from 'vuex'

export default {
  props: ['error'],
  components: {
    AppHeader,
    Sidebar
    // Footer
  },
  computed: mapState(['user'])
}
</script>