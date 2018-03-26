<template>
  <div>
    <h3 class="mb-4">
      <nuxt-link to=".">
        @{{name}}
      </nuxt-link>
      's followers
    </h3>
    <list :data="data" type="User" />
  </div>
</template>

<script>
import List from '~/components/List'

export default {
  async asyncData(ctx) {
    const { params, app: { $resource } } = ctx
    const { name } = params
    const data = await $resource()
    return {
      data,
      name
    }
  },
  components: {
    List
  },
  head() {
    return {
      title: `@${this.name}'s followers`
    }
  }
}
</script>
