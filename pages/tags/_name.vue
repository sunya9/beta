<template>
  <div>
    <emojify
      :text="`#${name}`"
      element="h3"
    />
    <a
      :href="'https://api.pnut.io/v0/feed/rss/posts/tags/' + name"
      class="card-link"
    >
      <font-awesome-icon
        icon="rss-square"
        aria-hidden="true"
        class="mr-2"
      />
      <span>RSS</span>
    </a>
    <post-list
      :key="name"
      :data="data"
    />
  </div>
</template>

<script>
import PostList from '~/components/PostList'
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
    PostList
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
