<template>
  <account :account="account" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Account from '~/components/molecules/settings/Account/index.vue'
import { PnutResponse } from '~/entity/pnut-response'
import { User } from '~/entity/user'

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
