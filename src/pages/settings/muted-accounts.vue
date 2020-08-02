<template>
  <div>
    <user-list :list-info="listInfo" :component-options="componentOptions" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import UserList from '~/components/organisms/UserList.vue'
import { ListInfo } from '~/plugins/domain/util/util'
import { User } from '~/entity/user'

@Component({
  components: {
    UserList,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getUsers.run({
      type: { type: 'muted' },
    })
    return {
      listInfo,
    }
  },
  head() {
    return {
      title: 'Muted Accounts',
    }
  },
})
export default class MutedAccounts extends Vue {
  listInfo!: ListInfo<User>
  componentOptions = {
    disableFollowButton: true,
    showUnmuteButton: true,
  }
}
</script>
