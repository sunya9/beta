<template>
  <div id="wrapper" class="mt-5 pt-5">
    <app-header />
    <main class="container">
      <div class="row">
        <div
          v-if="!notLoginIndex"
          :class="{
             'col-md-4 col-lg-3': !notLoginIndex,
          }"
          class="hidden-sm-down">
          <sidebar class="fixed-top sticky-top" style="top: 70px" />
        </div>
        <div
          :class="{
            'col-md-8 col-lg-9': !notLoginIndex
          }"
          class="col-12">
          <splash v-if="!user" />
          <nuxt />
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import AppHeader from '~components/Header'
import Sidebar from '~components/Sidebar'
import Splash from '~components/Splash'
import { mapState } from 'vuex'

export default {
  props: ['error'],
  components: {
    AppHeader,
    Sidebar,
    Splash
  },
  computed: {
    notLoginIndex() {
      return !this.user && this.$route.name === 'index'
    },
    ...mapState(['user'])
  }
}
</script>