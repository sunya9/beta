<template>
  <header>
    <nav class="navbar navbar-light navbar fixed-top px-0">
      <div
        class="container"
        @click.self="scrollToTop">
        <button
          class="navbar-toggler mr-2 d-md-none align-items-stretch"
          type="button"
          data-toggle="collapse"
          data-target="#globalNavigation"
          aria-controls="globalNavigation"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"/>
        </button>
        <nuxt-link
          class="p-0 navbar-brand text-uppercase d-inline-flex align-items-center"
          to="/"
          exact>
          <img
            src="~assets/img/beta.svg"
            width="32"
            height="32"
            alt="β"
            class="align-center mr-2 d-inline-block">
          <span class="d-none d-sm-inline header-title">
            Beta
          </span>
        </nuxt-link>
        <span class="navbar-text mr-auto">
          <a
            v-if="!online"
            href="#"
            class="badge badge-secondary"
            @click="showConnection">offline</a>
        </span>
        <search-form
          v-if="user"
          id="search-form"
          class="mr-md-4 order-4 order-md-1" />
        <ul class="order-2 navbar-nav d-flex flex-row align-items-stretch">
          <nuxt-link
            v-if="user"
            id="nav-messages"
            to="/messages"
            tag="li"
            class="nav-item d-none d-sm-block"
            title="Messages">
            <a class="nav-link">
              <font-awesome-icon icon="envelope"/>
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
              <font-awesome-icon
                size="lg"
                icon="database"
              />
            </a>
          </nuxt-link>
          <li
            v-if="user"
            id="user-menu"
            class="nav-item dropdown">
            <a
              id="navbarDropdownMenuLink"
              href="#"
              class="nav-link text-primary"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              <span>
                <span class="d-none d-sm-inline">{{ user.username }}</span>
                <span class="d-inline d-sm-none">
                  <avatar
                    :avatar="{ link: `https://api.pnut.io/v0/users/@${user.username}/avatar` }"
                    :size="16"
                    :max-size="16" />
                </span>
              </span>
              <font-awesome-icon
                class="ml-2"
                icon="chevron-down"
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              aria-labelledby="navbarDropdownMenuLink">
              <nuxt-link
                :to="`/@${user.username}`"
                data-toggle="collapse"
                class="dropdown-item"
                active-class=""
              >
                <span class="d-none d-sm-inline">Profile</span>
                <span class="d-inline d-sm-none">@{{ user.username }}</span>
              </nuxt-link>
              <div class="dropdown-divider d-sm-none"/>
              <nuxt-link
                to="/messages"
                class="dropdown-item d-sm-none"
              >
                Messages
              </nuxt-link>
              <nuxt-link
                class="dropdown-item d-sm-none"
                to="/files"
              >
                Files
              </nuxt-link>
              <div class="dropdown-divider"/>
              <nuxt-link
                data-toggle="collapse"
                to="/settings"
                class="dropdown-item"
                active-class=""
              >
                Settings
              </nuxt-link>
              <div class="dropdown-divider"/>
              <a
                href="#"
                class="dropdown-item"
                @click="$auth.logout()">Log out</a>
            </div>
          </li>
          <li
            v-if="user"
            id="nav-compose"
            class="nav-item d-sm-block">
            <a
              href="#"
              class="nav-link"
              @click.prevent="showPostModal">
              <font-awesome-icon icon="pencil-alt"/>
            </a>
          </li>
          <li
            v-if="!user"
            class="nav-item">
            <a
              href="#"
              class="nav-link"
              @click="$auth.loginWith('pnut')">Log in</a>
          </li>
        </ul>
      </div>
      <div class="container d-md-none">
        <app-sidebar
          id="globalNavigation"
          :style="{
            'max-height': collapseHeight
          }"
          class="collapse scrollable w-100"
        />
      </div>
    </nav>
    <slot name="jumbotron" />
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchForm from './SearchForm'
import AppSidebar from '~/components/sidebar/App'
import Avatar from '~/components/Avatar'
import bus from '~/assets/js/bus'

const networkEvents = ['online', 'offline']

export default {
  components: {
    SearchForm,
    AppSidebar,
    Avatar
  },
  data() {
    return {
      online: true,
      collapseHeight: 0
    }
  },
  computed: mapGetters(['user']),
  mounted() {
    this.online = navigator.onLine
    networkEvents.forEach(event =>
      window.addEventListener(event, this.connectionChanged)
    )
    const { height } = this.$el.children[0].getBoundingClientRect()
    this.collapseHeight = `calc(100vh - ${height}px)`
  },
  beforeDestroy() {
    networkEvents.forEach(event =>
      window.removeEventListener(event, this.connectionChanged)
    )
  },
  methods: {
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
    showPostModal() {
      bus.$emit('showPostModal')
    }
  }
}
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
.dropdown-menu {
  position: absolute;
}

.dropdown-menu-right {
  right: 0;
  left: auto;
  margin-top: 0;
}

.header-title {
  color: $themeSubText;
  font-weight: 400;
}
</style>
