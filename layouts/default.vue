<template>
  <div id="wrapper" class="mt-5 pt-5">
    <app-header>
      <component :is="sidebar" />
    </app-header>
    <main class="container">
      <div>
        <splash v-if="!user" class="mb-5" />
      </div>
      <div class="row">
        <div
          v-if="!notLoginIndex"
          :class="{
             'col-md-4 col-lg-3': !notLoginIndex,
          }"
          class="d-none d-sm-block">
          <transition name="slide" mode="out-in">
            <component :is="sidebar" />
          </transition>
        </div>
        <div
          :class="{
            'col-md-8 col-lg-9': !notLoginIndex
          }"
          class="col-12">
          <div>
            <nuxt />
          </div>
          <div>
            <post-modal ref="postModal" />
          </div>
          <div>
            <remove-modal ref="removeModal" />
          </div>
          <div>
            <help-modal ref="helpModal" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import AppHeader from '~components/Header'
import Splash from '~components/Splash'
import { mapState } from 'vuex'
import PostModal from '~components/PostModal'
import RemoveModal from '~components/RemoveModal'
import HelpModal from '~components/HelpModal'
import Mousetrap from 'mousetrap'
import AppSidebar from '~components/sidebar/App'
import SettingsSidebar from '~components/sidebar/Settings'
import AboutSidebar from '~components/sidebar/About'

export default {
  props: ['error'],
  components: {
    AppHeader,
    Splash,
    PostModal,
    RemoveModal,
    HelpModal,
    AppSidebar,
    SettingsSidebar,
    AboutSidebar
  },
  watch: {
    '$route.fullPath' () {
      this.$refs.removeModal.dismiss()
      this.$refs.postModal.dismiss()
    }
  },
  computed: {
    notLoginIndex () {
      return !this.user && this.$route.name === 'index'
    },
    sidebar () {
      const [, name] = this.$route.fullPath.match(/\/(\w+[^/])/) || []
      const map = {
        settings: 'SettingsSidebar',
        about: 'AboutSidebar'
      }
      return map[name] || 'AppSidebar'
    },
    ...mapState(['user'])
  },
  mounted () {
    const router = this.$router
    // new post
    Mousetrap.bind('n', () => this.$refs.postModal.showModal())
    Mousetrap.bind('?', () => this.$refs.helpModal.showModal())
    // main
    Mousetrap.bind('g h', () => router.push('/'))
    Mousetrap.bind('g m', () => router.push('/mentions'))
    Mousetrap.bind('g i', () => router.push('/interactions'))
    Mousetrap.bind('g s', () => router.push('/stars'))

    // explore
    Mousetrap.bind('g c', () => router.push('/conversations'))
    Mousetrap.bind('g p', () => router.push('/photos'))
    Mousetrap.bind('g t', () => router.push('/trending'))
    Mousetrap.bind('g g', () => router.push('/global'))
  },
  beforeDestroy () {
    Mousetrap.unbind('n')
    Mousetrap.unbind('?')

    Mousetrap.unbind('g m')
    Mousetrap.unbind('g i')
    Mousetrap.unbind('g s')

    // explore
    Mousetrap.unbind('g c')
    Mousetrap.unbind('g p')
    Mousetrap.unbind('g t')
    Mousetrap.unbind('g g')
  }
}
</script>

<style>
.slide-enter-active, .slide-leave-active {
  transition: all .3s ease;
}
.slide-enter, .slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>