<template>
  <header>
    <div class="navbar navbar-light navbar fixed-top px-0">
      <div class="container relative">

        <button v-if="$slots.menu"
          class="d-md-none mr-3 navbar-toggler align-self-center" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <nuxt-link class="mr-auto p-0 navbar-brand text-uppercase d-inline-flex align-items-center" to="/" exact data-toggle="collapse" data-target="#navbarSupportedContent.show">
          <img src="~assets/img/beta.png" width="32" height="32" alt="β" class="d-inline-block align-center mr-2">
          <span class="d-none d-sm-inline">
            Beta
          </span>
        </nuxt-link>
        <search-form class="mr-md-4 order-3 order-md-1" />
        <ul class="order-2 navbar-nav d-flex flex-row align-items-stretch">
          <li class="nav-item" v-if="user">
            <nuxt-link to="/files" class="nav-link text-dark">
              <i class="fa fa-database fa-lg"></i>
            </nuxt-link>
          </li>
          <li class="nav-item dropdown" v-if="user">
            <a href="#" class="nav-link" id="navbarDropdownMenuLink" data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              {{user.username}}
              <i class="fa fa-chevron-down"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <nuxt-link
                :to="`/@${user.username}`"
                exact
                data-toggle="collapse" data-target="#navbarSupportedContent.show"
                class="dropdown-item">
              Profile
              </nuxt-link>
              <div class="dropdown-divider"></div>
              <nuxt-link
                data-toggle="collapse"
                data-target="#navbarSupportedContent.show"
                to="/settings"
                class="dropdown-item">
                Settings
              </nuxt-link>
              <div class="dropdown-divider"></div>
              <a href="/logout" class="dropdown-item">Log out</a>
            </div>
          </li>
          <li class="nav-item" v-if="!user">
            <a href="/login" class="nav-link">Log in</a>
          </li>
        </ul>
      </div>
      <div
        id="navbarSupportedContent"
        class="navbar-collapse collapse d-md-none scrollable">
          <div class="container" :style="{
            'max-height': collapseHeight
          }">
            <slot name="menu" />
          </div>
      </div>
    </div>
    <slot name="jumbotron" />
  </header>
</template>

<script>
import { mapState } from 'vuex'
import SearchForm from './SearchForm'

export default {
  data() {
    return {
      collapseHeight: 0
    }
  },
  mounted() {
    const { height } = this.$el.children[0].getBoundingClientRect()
    this.collapseHeight = `calc(100vh - ${height}px)`
  },
  computed: mapState(['user']),
  components: {
    SearchForm
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/adn_base_variables';

.navbar {
  background-color: rgba(255, 255, 255, .95);
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
  .nav-link, button {
    border-right: 1px solid $grayLighter;
  }
  &:first-child {
    .nav-link, button {
      border-left: 1px solid $grayLighter;
    }
  }
}

.navbar-toggler {
  border: none;
  height: 100%;
  margin-left: -1px;
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
.relative {
  position: relative;
}
</style>
