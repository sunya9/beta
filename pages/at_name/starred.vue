<template>
  <div>
    <h3>
      <nuxt-link to=".">
        @{{ name }}
      </nuxt-link>
      's Starred
    </h3>
    <post-list :data="data" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PostList from '~/components/PostList.vue'

@Component({
  components: {
    PostList
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
  }
})
export default class extends Vue {
  name!: string
  head() {
    return {
      title: `@${this.name}'s starred`
    }
  }
}
</script>
