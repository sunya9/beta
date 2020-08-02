<template>
  <user-list v-if="listInfo" :list-info="listInfo" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { ListInfo } from '~/plugins/domain/util/util'
import UserList from '~/components/organisms/UserList.vue'
import { User } from '~/entity/user'

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
    try {
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
    } catch (e) {}
    return {
      name,
    }
  },
})
export default class Followers extends Vue {
  name!: string
  listInfo: ListInfo<User> | null = null
  head() {
    return {
      title: `@${this.name}'s followers`,
    }
  }
}
</script>
