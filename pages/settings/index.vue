<template>
  <account :account="account" />
</template>

<script>
import Account from '~/components/settings/Account'

export default {
  components: {
    Account
  },
  async asyncData({ app: { $axios } }) {
    const { data: account } = await $axios.$get('/users/me')
    return {
      account
    }
  },
  head() {
    return {
      title: 'Account settings'
    }
  }
}
</script>
