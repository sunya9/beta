<template>
  <account :account="account" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Account from '~/components/molecules/settings/Account/index.vue'
import { User } from '~/entity/user'

@Component({
  components: {
    Account,
  },
  async asyncData({ app: { $interactors } }) {
    const {
      user: { data: account },
    } = await $interactors.getProfile.run({
      username: 'me',
    })
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
