<template>
  <user-list v-if="listInfo" :list-info="listInfo" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { User } from '~/entity/user'
import UserList from '~/components/organisms/UserList.vue'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
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
          type: 'following',
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
export default class Follows extends Vue {
  name!: string
  listInfo: ListInfo<User> | null = null
  head() {
    return {
      title: `@${this.name}'s following`,
    }
  }
}
</script>
