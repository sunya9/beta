<template>
  <account :account="account" />
</template>

<script>
import Account from '~/components/settings/Account'

export default {
  async asyncData({ app: { $axios } }) {
    const { data: account } = await $axios.$get('/users/me')
    return {
      account
    }
  },
  components: {
    Account
  },
  head() {
    return {
      title: 'Account settings'
    }
  }
}
</script>
