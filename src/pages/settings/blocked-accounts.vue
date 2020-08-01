<template>
  <div>
    <user-list :list-info="listInfo" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import UserList from '~/components/organisms/UserList.vue'
import { ListInfo } from '~/plugins/domain/util/util'
import { User } from '~/models/user'

@Component({
  components: {
    UserList,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getUsers.run({
      type: { type: 'blocked' },
    })
    return { listInfo }
  },
  head() {
    return {
      title: 'Blocked Accounts',
    }
  },
})
export default class BlockedAccounts extends Vue {
  listInfo!: ListInfo<User>
}
</script>
