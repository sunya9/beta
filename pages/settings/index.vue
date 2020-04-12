<template>
  <account :account="account" />
</template>

<script lang="ts">
import Vue from 'vue'
import Account from '~/components/settings/Account/index.vue'
import { PnutResponse } from '~/models/pnut-response'
import { User } from '~/models/user'

export default Vue.extend({
  components: {
    Account,
  },
  async asyncData({ app: { $axios } }) {
    const { data: account } = await $axios.$get<PnutResponse<User>>('/users/me')
    return {
      account,
    }
  },
  head() {
    return {
      title: 'Account settings',
    }
  },
})
</script>
