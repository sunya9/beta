<template>
  <div id="wrapper" :style="`margin-top: 48px`" class="wrapper mb-3">
    <app-header ref="header" />
    <main class="container main">
      <div class="row">
        <transition name="slide" mode="out-in">
          <div
            v-if="!notLoginIndex && menusWithMeta.menus.length"
            :class="{
              'col-md-4 col-lg-3': !notLoginIndex,
            }"
          >
            <div class="navbar navbar-light p-0">
              <div class="d-md-block collapse navbar-collapse">
                <sidebar />
              </div>
            </div>
          </div>
        </transition>
        <div
          :class="{
            'col-md-8 col-lg-9': !notLoginIndex && menusWithMeta.menus.length,
          }"
          class="col-12"
        >
          <page-title />
          <div id="navbarSupportedContent" class="collapse">
            <sidebar v-if="!menusWithMeta.isDefault" narrow />
          </div>
          <div>
            <nuxt />
          </div>
        </div>
      </div>
    </main>
    <post-modal />
    <remove-modal />
    <message-modal />
    <help-modal />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { getMenusWithMeta } from '~/components/sidebar/MenuItem'
import AppHeader from '~/components/organisms/Header.vue'
import PostModal from '~/components/PostModal.vue'
import RemoveModal from '~/components/RemoveModal.vue'

import MessageModal from '~/components/MessageModal.vue'
import HelpModal from '~/components/organisms/HelpModal.vue'
import Sidebar from '~/components/sidebar/Sidebar.vue'
import PageTitle from '~/components/atoms/PageTitle.vue'
import { User } from '~/models/user'

@Component({
  components: {
    AppHeader,
    PostModal,
    RemoveModal,
    MessageModal,
    HelpModal,
    Sidebar,
    PageTitle,
  },
})
export default class Default extends Vue {
  commonShortcuts = {
    '?'(this: Vue) {
      this.$modal.show('help-modal')
    },
    'g h'(this: Vue) {
      this.$router.push('/')
    },
    'g m'(this: Vue) {
      this.$router.push('/mentions')
    },
    'g i'(this: Vue) {
      this.$router.push('/interactions')
    },
    'g s'(this: Vue) {
      this.$router.push('/stars')
    },

    // explore
    'g c'(this: Vue) {
      this.$router.push('/conversations')
    },
    'g p'(this: Vue) {
      this.$router.push('/photos')
    },
    'g t'(this: Vue) {
      this.$router.push('/trending')
    },
    'g g'(this: Vue) {
      this.$router.push('/global')
    },
  }

  streamsShortcuts = {
    n(this: Vue) {
      this.$modal.show('post-modal')
    },
  }

  channelsShortcuts = {
    m(this: Vue) {
      this.$modal.show('message-modal', {
        isPrivate: true,
      })
    },
    c(this: Vue) {
      this.$modal.show('message-modal', {
        isPrivate: false,
      })
    },
  }

  bodyClass = ''

  get notLoginIndex(): boolean {
    return !this.user && this.$route.name === 'index'
  }

  get searchPage(): boolean {
    return !!this.$route && !!this.$route.fullPath.match(/^\/search/)
  }

  get menusWithMeta() {
    return getMenusWithMeta(this)
  }

  get user(): User | null {
    return this.$accessor.user
  }

  @Watch('$route')
  onRouteChange() {
    if (process.server) return
    this.$mousetrap.reset()
    this.keyboardBind()
  }

  mounted() {
    // // dark theme
    if (process.browser) {
      if (localStorage.getItem(`dark_theme`) === 'true') {
        this.bodyClass = 'dark'
      }
    }
    this.keyboardBind()
  }

  beforeDestroy() {
    this.keyboardBind(true)
  }

  head() {
    return {
      bodyAttrs: {
        class: this.bodyClass,
      },
    }
  }

  keyboardBind(unbind = false) {
    this.$mousetrap.reset()
    if (unbind) return
    const context =
      this.$route.name && this.$route.name.startsWith('channels')
        ? 'channels'
        : 'streams'
    this.keyboardBinding()
    this.keyboardBinding(context)
  }

  keyboardBinding(context?: string) {
    const contextKey = `${context || 'common'}Shortcuts`
    // TODO
    Object.keys((this as any)[contextKey]).forEach((shortcutKey) => {
      this.$mousetrap.bind(
        shortcutKey,
        (this as any)[contextKey][shortcutKey].bind(this)
      )
    })
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
</style>
