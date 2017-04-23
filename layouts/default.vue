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
import Sidebar from '~components/Sidebar'
import Splash from '~components/Splash'
import { mapState } from 'vuex'
import PostModal from '~components/PostModal'
import RemoveModal from '~components/RemoveModal'
import HelpModal from '~components/HelpModal'
import router from '~router'
import bus from '~assets/js/bus'
import Mousetrap from '~plugins/mousetrap'

export default {
  props: ['error'],
  components: {
    AppHeader,
    Sidebar,
    Splash,
    PostModal,
    RemoveModal,
    HelpModal
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