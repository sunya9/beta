<template>
  <header>
    <div class="navbar navbar-light navbar fixed-top d-block px-0">
      <div class="container">
        <div class="d-flex align-items-center">
          <nuxt-link class="navbar-brand text-uppercase d-inline-flex align-items-center" to="/" exact data-toggle="collapse" data-target="#navbarSupportedContent.show">
          <img src="~assets/img/beta.png" width="32" height="32" alt="β" class="d-inline-block align-center mr-2">
            Beta
          </nuxt-link>
          <ul class="navbar-nav ml-auto d-flex flex-row align-items-stretch">
            <li class="nav-item dropdown" v-if="user">
              <a href="#" class="nav-link" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
            <li class="nav-item" v-if="$slots.default">
              <button class="hidden-md-up navbar-toggler align-self-center" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
            </li>
          </ul>
        </div>
        <div
          id="navbarSupportedContent"
          :style="{
            'max-height': collapseHeight
          }"
          class="navbar-collapse collapse hidden-md-up scrollable">
          <slot />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      collapseHeight: 0
    }
  },
  mounted () {
    const { height } = this.$el.children[0].getBoundingClientRect()
    this.collapseHeight = `calc(100vh - ${height}px)`
  },
  computed: mapState(['user'])
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';

.navbar {
  background-color: rgba(255, 255, 255, .95);
  z-index: 1030;
  border-bottom: 1px solid $grayLighter;
}
// buggy?
.nav-link {
  padding: 1rem 2.5rem;
  border-left: 1px solid $grayLighter;
  border-right: 1px solid $grayLighter;
}

.navbar-toggler {
  border-left: 1px solid $grayLighter;
  border-right: 1px solid $grayLighter;
  height: 100%;
  margin-left: -1px;
}
.dropdown-divider {
  margin: 0;
}

.show.scrollable {
  overflow: auto;
}

</style>