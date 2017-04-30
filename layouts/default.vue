<template>
  <div id="wrapper" class="mt-5 pt-5">
    <app-header>
      <component :is="sidebar" />
    </app-header>
    <main class="container">
      <div class="row">
        <div
          v-if="!notLoginIndex"
          :class="{
             'col-md-4 col-lg-3': !notLoginIndex,
          }"
          class="hidden-sm-down">
          <div class="fixed-top sticky-top" style="top: 70px">
            <transition name="slide" mode="out-in">
              <component :is="sidebar" />
            </transition>
          </div>
        </div>
        <div
          :class="{
            'col-md-8 col-lg-9': !notLoginIndex
          }"
          class="col-12">
          <div>
            <splash v-if="!user" />
          </div>
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
import router from '~router'
import bus from '~assets/js/bus'
import Mousetrap from '~plugins/mousetrap'
import AppSidebar from '~components/sidebar/App'
import SettingsSidebar from '~components/sidebar/Settings'

export default {
  props: ['error'],
  components: {
    AppHeader,
    Splash,
    PostModal,
    RemoveModal,
    HelpModal,
    AppSidebar,
    SettingsSidebar
  },
  watch: {
    '$route.fullPath'() {-
      this.$refs.removeModal.dismiss()
      this.$refs.postModal.dismiss()
    }
  },
  computed: {
    notLoginIndex() {
      return !this.user && this.$route.name === 'index'
    },
    isSettingsPage() {
      return this.$route.fullPath.startsWith('/settings')
    },
    sidebar() {
      return this.isSettingsPage
        ? 'SettingsSidebar'
        : 'AppSidebar'
    },
    ...mapState(['user'])
  },
  mounted() {
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
  beforeDestroy() {
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