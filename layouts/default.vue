<template>
  <div
    id="wrapper"
    :style="`margin-top: 48px`"
    class="wrapper mb-3">
    <app-header ref="header">
      <jumbotron
        v-if="searchPage"
        slot="jumbotron"
        class="jumbotron" />
    </app-header>
    <main class="container main">
      <div class="row">
        <div
          v-if="!notLoginIndex"
          :class="{
            'col-md-4 col-lg-3': !notLoginIndex,
        }">
          <div class="navbar navbar-light p-0">
            <div class="d-md-block collapse navbar-collapse">
              <transition
                name="slide"
                mode="out-in">
                <component
                  ref="sidebar"
                  :is="sidebar" />
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
            v-if="!notLoginIndex"
            :class="{
              'justify-content-between mb-4': selectedDropdownItem,
              'justify-content-end': !selectedDropdownItem
            }"
            class="d-flex align-items-center mb-0"
          >
            <div
              v-if="selectedDropdownItem"
              class="d-flex align-items-center">
              <div
                class="d-block bg-primary text-center rounded-circle text-white border-white mr-1 icon">
                <font-awesome-icon
                  :icon="selectedDropdownItem.icon"
                  fixed-width
                />
              </div>
              {{ selectedDropdownItem.label }}
            </div>

            <div
              v-if="sidebar && !isAppSidebar"
              class="ml-3 d-md-none h4 mb-1 mt-1">
              <a
                data-toggle="collapse"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle local navigation"
                data-target="#navbarSupportedContent"
              >
                <font-awesome-icon
                  icon="bars"
                  size="lg"
                />
              </a>
            </div>
          </h3>
          <div
            id="navbarSupportedContent"
            class="collapse"
          >
            <component
              v-if="!isAppSidebar"
              :is="sidebar"
              narrow />
          </div>
          <div>
            <nuxt />
          </div>
        </div>
      </div>
    </main>
    <post-modal />
    <remove-modal />
    <message-remove-modal />
    <message-modal />
    <channel-edit-modal />
    <channel-member-edit-modal />
    <help-modal />
  </div>
</template>
<script>
import AppHeader from '~/components/Header'
import { mapGetters } from 'vuex'
import PostModal from '~/components/PostModal'
import RemoveModal from '~/components/RemoveModal'
import MessageRemoveModal from '~/components/MessageRemoveModal'
import ChannelEditModal from '~/components/ChannelEditModal'
import ChannelMemberEditModal from '~/components/ChannelMemberEditModal'
import MessageModal from '~/components/MessageModal'
import HelpModal from '~/components/HelpModal'
import Mousetrap from 'mousetrap'
import AppSidebar from '~/components/sidebar/App'
import SettingsSidebar from '~/components/sidebar/Settings'
import AboutSidebar from '~/components/sidebar/About'
import FilesSidebar from '~/components/sidebar/Files'
import SearchSidebar from '~/components/sidebar/Search'
import Jumbotron from '~/components/Jumbotron'
import Vue from 'vue'
import { underMessages } from '~/assets/js/util'

export default {
  components: {
    AppHeader,
    PostModal,
    RemoveModal,
    MessageRemoveModal,
    ChannelEditModal,
    ChannelMemberEditModal,
    MessageModal,
    HelpModal,
    AppSidebar,
    SettingsSidebar,
    AboutSidebar,
    FilesSidebar,
    SearchSidebar,
    Jumbotron
  },
  mixins: [underMessages],
  props: {
    error: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      bodyClass: ''
    }
  },
  computed: {
    isAppSidebar() {
      return this.sidebarName === 'AppSidebar'
    },
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
      if (!this.$route.name) return null
      const matcher = this.$route.name.match(/^[\w@]*/)
      return matcher ? matcher[0] : ''
    },
    sidebar() {
      return this.$options.components[this.sidebarName]
    },
    sidebarName() {
      const name = this.routeName
      const map = {
        settings: 'SettingsSidebar',
        about: 'AboutSidebar',
        files: 'FilesSidebar',
        search: 'SearchSidebar',
        messages: null,
        null: null
      }
      return map[name] || (map[name] !== null && 'AppSidebar')
    },
    ...mapGetters(['user'])
  },
  mounted() {
    // // dark theme
    if (process.browser) {
      if (localStorage.getItem(`dark_theme`) === 'true') {
        this.bodyClass = 'dark'
      }
    }

    const router = this.$router
    // new post
    Mousetrap.bind('n', () => {
      if (this.underMessages) return
      this.$modal.show('post-modal')
    })
    Mousetrap.bind('m', () => {
      if (!this.underMessages) return
      this.$modal.show('message-modal', {
        isPrivate: true
      })
    })

    Mousetrap.bind('c', () => {
      if (!this.underMessages) return
      this.$modal.show('message-modal', {
        isPrivate: false
      })
    })

    Mousetrap.bind('?', () => this.$modal.show('help-modal'))
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
    Mousetrap.unbind(['m', 'c'])

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
  transition: all 0.1s ease;
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
  > svg {
    vertical-align: -0.25rem;
  }
}
</style>
