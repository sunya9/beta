<template>
  <div>
    <user-list :data="data" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import UserList from '~/components/UserList.vue'

@Component({
  components: {
    UserList
  },
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return {
      data
    }
  },
  head() {
    return {
      title: 'Blocked Accounts'
    }
  }
})
export class BlockedAccounts extends Vue {}
</script>
