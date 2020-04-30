<template>
  <div>
    <h3 class="mb-4">
      <nuxt-link to=".">@{{ name }}</nuxt-link>
      's followers
    </h3>
    <user-list :data="data" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import UserList from '~/components/UserList.vue'
import { User } from '~/models/user'
import { PnutResponse } from '~/models/pnut-response'

type Data = {
  name: string
}

@Component({
  components: {
    UserList,
  },
  async asyncData(ctx) {
    const {
      params,
      app: { $resource },
      error,
    } = ctx
    const { name } = params
    try {
      const data = await $resource()
      return {
        data,
        name,
      }
    } catch (e) {
      const { meta } = e.response.data
      error({
        statusCode: meta.code,
        message: meta.error_message,
      })
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
  data!: PnutResponse<User[]>
}
</script>
