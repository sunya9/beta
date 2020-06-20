<template>
  <div>
    <h3 class="mb-4">
      <nuxt-link to=".">@{{ name }}</nuxt-link>
      's followers
    </h3>
    <user-list :list-info="listInfo" />
  </div>
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
      type: 'followers',
      username: `@${name}`,
    })
    return {
      listInfo,
      name,
    }
  },
  head(this: Followers) {
    return {
      title: `@${this.name}'s followers`,
    }
  },
})
export default class Followers extends Vue {
  name!: string
  listInfo!: ListInfo<User>
}
</script>
