<template>
  <div>
    <h3 v-emojify>#{{ name }}</h3>
    <a
      :href="'https://api.pnut.io/v0/feed/rss/posts/tags/' + name"
      class="card-link">
      <font-awesome-icon
        icon="rss-square"
        aria-hidden="true"
        class="mr-2"
      />
      <span>RSS</span>
    </a>
    <list
      :data="data"
      :key="name"
      type="Post" />
  </div>
</template>

<script>
import List from '~/components/List'
import { getRSSLink } from '~/assets/js/util'

export default {
  async asyncData({ app: { $resource }, params }) {
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
    const link = [
      getRSSLink(`https://api.pnut.io/v0/feed/rss/posts/tags/${this.name}`)
    ]
    return {
      title: `#${this.name}`,
      link
    }
  }
}
</script>
