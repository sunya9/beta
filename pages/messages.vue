<template>
  <div>
    <div class="row">
      <div v-if="$auth.loggedIn" class="col-md-8">
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <nuxt-link
              :class="{ active: isPM === true }"
              to="/messages"
              class="nav-link"
              exact
            >
              Messages
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              :class="{ active: isPM === false }"
              to="/messages?public"
              class="nav-link"
            >
              Chat Rooms
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
    <nuxt-child :key="$route.params.channel" @updateNav="isPM = $event" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      isPM: null as boolean | null
    }
  },
  watch: {
    '$route.fullPath'() {
      this.isPM = null
    }
  }
})
</script>
