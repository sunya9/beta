<template>
  <header>
    <nav class="navbar navbar-light navbar fixed-top px-0">
      <div class="container" @click.self="scrollToTop">
        <button
          class="navbar-toggler mr-2 d-md-none align-items-stretch"
          type="button"
          aria-controls="globalNavigation"
          aria-label="Toggle globalNavigation"
          :aria-expanded="globalNavigation.toString()"
          @click="$root.$emit('bv::toggle::collapse', 'globalNavigation')"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <nuxt-link
          class="
            p-0
            navbar-brand
            text-uppercase
            d-inline-flex
            align-items-center
          "
          to="/"
          exact
        >
          <img
            src="~assets/img/beta.svg"
            width="32"
            height="32"
            alt="β"
            class="align-center mr-2 d-inline-block"
          />
          <span class="d-none d-sm-inline header-title">Beta</span>
        </nuxt-link>
        <span class="navbar-text mr-auto">
          <a
            v-if="!online"
            href="#"
            class="badge badge-secondary"
            @click="showConnection"
          >
            offline
          </a>
        </span>
        <search-form
          v-if="user"
          id="search-form"
          class="mr-md-4 order-4 order-md-1"
        />
        <ul class="order-2 navbar-nav d-flex flex-row align-items-stretch">
          <nuxt-link
            v-if="user"
            id="nav-messages"
            to="/channels"
            tag="li"
            class="nav-item d-none d-sm-block"
            title="Messages"
          >
            <a class="nav-link">
              <message-icon />
            </a>
          </nuxt-link>
          <nuxt-link
            v-if="user"
            id="nav-files"
            class="nav-item d-none d-sm-block"
            title="Files"
            tag="li"
            to="/files"
          >
            <a class="nav-link">
              <font-awesome-icon size="lg" icon="database" />
            </a>
          </nuxt-link>
          <li v-if="user" id="user-menu" class="nav-item dropdown">
            <app-dropdown v-model="visible">
              <template #button>
                <a
                  id="navbarDropdownMenuLink"
                  ref="dropdown"
                  href="#"
                  class="nav-link text-primary"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  :aria-expanded="visible ? 'true' : 'false'"
                  @click.prevent
                >
                  <span>
                    <span class="d-none d-sm-inline">
                      {{ user.username }}
                    </span>
                    <span class="d-inline d-sm-none">
                      <avatar
                        :avatar="{
                          link: `https://api.pnut.io/v0/users/@${user.username}/avatar`,
                        }"
                        :size="16"
                        :max-size="16"
                      />
                    </span>
                  </span>
                  <font-awesome-icon class="ml-2" icon="chevron-down" />
                </a>
              </template>
              <div
                class="dropdown-menu dropdown-menu-right show position-absolute"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <nuxt-link
                  :to="`/@${user.username}`"
                  class="dropdown-item"
                  active-class=""
                >
                  <span class="d-none d-sm-inline">Profile</span>
                  <span class="d-inline d-sm-none">@{{ user.username }}</span>
                </nuxt-link>
                <div class="dropdown-divider d-sm-none" />
                <nuxt-link to="/channels" class="dropdown-item d-sm-none">
                  Messages
                </nuxt-link>
                <nuxt-link class="dropdown-item d-sm-none" to="/files">
                  Files
                </nuxt-link>
                <div class="dropdown-divider" />
                <nuxt-link to="/settings" class="dropdown-item" active-class="">
                  Settings
                </nuxt-link>
                <div class="dropdown-divider" />
                <nuxt-link to="/logout" class="dropdown-item">
                  Log out
                </nuxt-link>
              </div>
            </app-dropdown>
          </li>
          <li v-if="user" id="nav-compose" class="nav-item d-sm-block">
            <a
              href="#"
              class="nav-link"
              @click.prevent="$modal.show('post-modal')"
            >
              <font-awesome-icon icon="pencil-alt" />
            </a>
          </li>
          <li v-if="!user" class="nav-item">
            <a href="#" class="nav-link" @click="$auth.loginWith('pnut')">
              Log in
            </a>
          </li>
        </ul>
      </div>
      <div class="container d-md-none">
        <b-collapse
          id="globalNavigation"
          v-model="globalNavigation"
          class="w-100 scrollable"
        >
          <sidebar
            :style="{
              'max-height': collapseHeight,
            }"
            always-default
            class=""
          />
        </b-collapse>
      </div>
    </nav>
    <slot name="jumbotron" />
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import SearchForm from '~/components/molecules/SearchForm.vue'
import Sidebar from '~/components/organisms/sidebar/Sidebar.vue'
import Avatar from '~/components/atoms/Avatar.vue'
import { User } from '~/entity/user'
import MessageIcon from '~/components/organisms/MessageIcon.vue'
import AppDropdown from '~/components/molecules/AppDropdown.vue'

const networkEvents = ['online', 'offline']

export default Vue.extend({
  components: {
    SearchForm,
    Sidebar,
    Avatar,
    MessageIcon,
    AppDropdown,
  },
  data() {
    return {
      online: true,
      collapseHeight: 0 as number | string,
      visible: false,
      globalNavigation: false,
    }
  },
  computed: {
    user(): User | null {
      return this.$accessor.user
    },
  },
  mounted() {
    this.online = navigator.onLine
    networkEvents.forEach((event) =>
      window.addEventListener(event, this.connectionChanged)
    )
    const { height } = this.$el.children[0].getBoundingClientRect()
    this.collapseHeight = `calc(100vh - ${height}px)`
    this.setupCloseNavEvent()
  },
  beforeDestroy() {
    networkEvents.forEach((event) =>
      window.removeEventListener(event, this.connectionChanged)
    )
  },
  methods: {
    setupCloseNavEvent() {
      this.$router.beforeEach((_to, _from, next) => {
        next()
        if (!this.globalNavigation) return
        this.$root.$emit('bv::toggle::collapse', 'globalNavigation')
      })
    },
    scrollToTop() {
      this.$scrollTo('body')
    },
    connectionChanged() {
      this.online = navigator.onLine
      if (!this.online) this.showConnection()
    },
    showConnection() {
      this.$toast.show(`You are ${this.online ? 'on' : 'off'}line`).goAway(2000)
    },
  },
})
</script>
<style scoped lang="scss">
@import '~assets/css/adn_base_variables';

.navbar {
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 1030;
  border-bottom: 1px solid $grayLighter;
}

.navbar-brand {
  font-size: 200%;
  font-weight: 300;
  color: $gray;
}

.nav-link {
  padding: 1rem 1.5rem;
}

.nav-item {
  .nav-link,
  button {
    border-right: 1px solid $grayLighter;
    border-left: 1px solid $grayLighter;
    margin-right: -1px;
  }
  &:last-child {
    .nav-link,
    button {
      margin-right: 0;
    }
  }
}

.navbar-toggler {
  border: none;
  padding-left: 0;
  padding-right: 0;
}

.dropdown-divider {
  margin: 0;
}

.show.scrollable {
  overflow: auto;
}

.dropdown-menu-right {
  right: -1px;
  left: auto;
  margin-top: 0;
}

.header-title {
  color: $themeSubText;
  font-weight: 400;
}
</style>
