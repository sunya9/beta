<template>
  <div>
    <h3 class="mb-4">
      <nuxt-link to=".">
        @{{ name }}
      </nuxt-link>
      's followers
    </h3>
    <user-list :data="data" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import UserList from '~/components/UserList.vue'

type Data = {
  name: string
}

export default Vue.extend<Data, {}, {}, {}>({
  components: {
    UserList
  },
  async asyncData(ctx) {
    const {
      params,
      app: { $resource },
      error
    } = ctx
    const { name } = params
    try {
      const data = await $resource()
      return {
        data,
        name
      }
    } catch (e) {
      const { meta } = e.response.data
      error({
        statusCode: meta.code,
        message: meta.error_message
      })
    }
  },
  head() {
    return {
      title: `@${this.name}'s followers`
    }
  }
})
</script>
