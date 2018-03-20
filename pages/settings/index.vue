<template>
  <account :account="account" />
</template>

<script>
import api from '~/plugins/api'
import Account from '~/components/settings/Account'

export default {
  async asyncData(ctx) {
    const { data: account } = await api(ctx).get('/users/me')
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
