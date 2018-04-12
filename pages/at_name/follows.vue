<template>
  <div>
    <h3 class="mb-4">
      <nuxt-link to=".">
        @{{name}}
      </nuxt-link>
      's following
    </h3>
    <list :data="data" type="User" />
  </div>
</template>

<script>
import List from '~/components/List'

export default {
  async asyncData(ctx) {
    const { params, app: { $resource }, error } = ctx
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
  components: {
    List
  },
  head() {
    return {
      title: `@${this.name}'s following`
    }
  }
}
</script>
