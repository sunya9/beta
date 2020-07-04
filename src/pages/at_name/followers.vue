<template>
  <user-list :list-info="listInfo" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { ListInfo } from '~/plugins/domain/util/util'
import UserList from '~/components/UserList.vue'
import { User } from '~/models/user'

@Component({
  middleware: 'auth',
  components: {
    UserList,
  },
  async asyncData(ctx) {
    const {
      params,
      app: { $interactors },
    } = ctx
    const { name } = params
    const { listInfo } = await $interactors.getUsers.run({
      type: {
        type: 'followers',
        userId: `@${name}`,
      },
    })
    return {
      listInfo,
      name,
    }
  },
})
export default class Followers extends Vue {
  name!: string
  listInfo!: ListInfo<User>
  head() {
    return {
      title: `@${this.name}'s followers`,
    }
  }
}
</script>
