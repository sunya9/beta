<template>
  <account :account="account" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Account from '~/components/settings/Account/index.vue'
import { PnutResponse } from '~/models/pnut-response'
import { User } from '~/models/user'

@Component({
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
export default class extends Vue {
  account!: User
}
</script>
