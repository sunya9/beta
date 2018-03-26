<template>
  <div>
    <h3>
      <nuxt-link to=".">
        @{{name}}
      </nuxt-link>
      's Starred
    </h3>
    <list :data="data" type="Post" />
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
      title: `@${this.name}'s starred`
    }
  }
}
</script>
