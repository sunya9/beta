<template>
  <div id="wrapper" class="wrapper mb-3" :style="`margin-top: ${marginTop}px`">
    <app-header ref="header">
      <jumbotron v-if="searchPage" slot="jumbotron" class="jumbotron" />
    </app-header>
    <main class="container main">
      <div>
        <splash v-if="!user" class="mb-5" />
      </div>
      <div class="row">
        <div
          v-if="!notLoginIndex"
          :class="{
             'col-md-4 col-lg-3': !notLoginIndex,
          }">
          <div class="navbar navbar-light p-0">
            <div class="d-md-block collapse navbar-collapse">
              <transition name="slide" mode="out-in">
                <component :is="sidebar" ref="sidebar" />
              </transition>
            </div>
          </div>
        </div>
        <div
          :class="{
            'col-md-8 col-lg-9': !notLoginIndex && sidebar
          }"
          class="col-12">
          <h3
            class="d-flex align-items-center mb-4"
            :class="{
              'justify-content-between': selectedDropdownItem,
              'justify-content-end  mb-md-0': !selectedDropdownItem
            }"
          >
            <div class="d-flex align-items-center" v-if="selectedDropdownItem">
              <div
                class="d-block bg-primary text-center rounded-circle text-white border-white mr-1 icon">
                <i class="fa fa-fw" :class="selectedDropdownItem.icon"></i>
              </div>
              {{selectedDropdownItem.label}}
            </div>

            <div class="ml-3 d-md-none h4 mb-1 mt-1" v-if="sidebar">
              <a
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle local navigation"
              >
                <i class="fa fa-bars fa-lg"></i>
              </a>
            </div>
          </h3>
          <component :is="sidebar" id="navbarSupportedContent" class="collapse" narrow />
          <div>
            <nuxt ref="nuxt" />
          </div>
        </div>
      </div>
    </main>
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
</template>
<script>
import AppHeader from '~/components/Header'
import Splash from '~/components/Splash'
import { mapState } from 'vuex'
import PostModal from '~/components/PostModal'
import RemoveModal from '~/components/RemoveModal'
import HelpModal from '~/components/HelpModal'
import Mousetrap from 'mousetrap'
import AppSidebar from '~/components/sidebar/App'
import SettingsSidebar from '~/components/sidebar/Settings'
import AboutSidebar from '~/components/sidebar/About'
import FilesSidebar from '~/components/sidebar/Files'
import SearchSidebar from '~/components/sidebar/Search'
import Jumbotron from '~/components/Jumbotron'
import $ from 'jquery'
import Vue from 'vue'

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
    AboutSidebar,
    FilesSidebar,
    SearchSidebar,
    Jumbotron
  },
  watch: {
    '$route.fullPath'() {
      this.$refs.removeModal.dismiss()
      this.$refs.postModal.dismiss()
      $('#sidebarContent').collapse('hide')
    }
  },
  data() {
    return {
      marginTop: 48, // default margin size
      bodyClass: ''
    }
  },
  computed: {
    notLoginIndex() {
      return !this.user && this.$route.name === 'index'
    },
    searchPage() {
      return this.$route.fullPath.match(/^\/search/)
    },
    dropdownItems() {
      if (!this.sidebar) return []
      const inst = new Vue({
        ...this.sidebar,
        store: this.$store,
        router: this.$router
      }).$mount()
      const items = (inst.menus || []).slice(1)
      return items
    },
    selectedDropdownItem() {
      return this.dropdownItems.filter(item => item.url === this.$route.path)[0]
    },
    routeName() {
      return this.$route.name.match(/^[\w@]+/)[0]
    },
    sidebar() {
      const name = this.routeName
      const map = {
        settings: 'SettingsSidebar',
        about: 'AboutSidebar',
        files: 'FilesSidebar',
        search: 'SearchSidebar',
        messages: null
      }
      const componentName = map[name] || (map[name] !== null && 'AppSidebar')
      return this.$options.components[componentName]
    },
    ...mapState(['user'])
  },
  mounted() {
    // dark theme
    if (process.browser) {
      if (localStorage.getItem(`dark_theme`) === 'true') {
        this.bodyClass = 'dark'
      }
    }

    const { height } = this.$refs.header.$el
      .querySelector('.navbar')
      .getBoundingClientRect()
    this.marginTop = height
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
  },
  head() {
    return {
      bodyAttrs: {
        class: this.bodyClass
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/override';

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.main {
  margin-top: 100px;
}
.jumbotron {
  margin-bottom: -50px;
  padding-top: 4rem;
}
.icon {
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  vertical-align: middle;
  overflow: hidden;
  border: 3px double white;
  > i {
    vertical-align: -0.1rem;
  }
}
</style>
