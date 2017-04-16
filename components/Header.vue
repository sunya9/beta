<template>
  <header>
    <div class="navbar navbar-light bg-navbar fixed-top">
      <div class="container d-flex">
        <nuxt-link class="navbar-brand" to="/" exact>
          Beta
        </nuxt-link>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item dropdown" v-if="user">
            <a href="" class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {{user.username}}
              <i class="icon-chevron-down"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
              <nuxt-link :to="`@${user.username}`" class="dropdown-item">Profile</nuxt-link>
              <a href="/logout" class="dropdown-item">Log out</a>
            </div>
          </li>
          <li class="nav-item" v-if="!user">
            <a href="/login" class="nav-link dropdown-toggle">Log in</a>
          </li>
        </ul>
        <button class="hidden-md-up navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['user'])
}

</script>
<style scoped>

.bg-navbar {
  background-color: rgba(255, 255, 255, .95);
  z-index: 5123;
  // border-bottom: 1px solid #ccc;
}

</style>