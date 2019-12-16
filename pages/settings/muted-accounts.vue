<template>
  <div>
    <user-list :data="data" :component-options="options" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import UserList from '~/components/UserList.vue'

export default Vue.extend({
  components: {
    UserList
  },
  data() {
    return {
      options: {
        disableFollowButton: true,
        showUnmuteButton: true
      }
    }
  },
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return {
      data
    }
  },
  head() {
    return {
      title: 'Muted Accounts'
    }
  }
})
</script>
