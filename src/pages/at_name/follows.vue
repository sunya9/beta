<template>
  <div>
    <h3 class="mb-4">
      <nuxt-link to=".">@{{ name }}</nuxt-link>
      's following
    </h3>
    <user-list :list-info="listInfo" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import { User } from '~/models/user'
import UserList from '~/components/UserList.vue'
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
  },
  head(this: Follows) {
    return {
      title: `@${this.name}'s following`,
    }
  },
})
export default class Follows extends Vue {
  name!: string
  listInfo!: ListInfo<User>
}
</script>
