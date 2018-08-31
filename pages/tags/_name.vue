<template>
  <div>
    <h3 v-emojify>#{{ name }}</h3>
    <a
      :href="'https://api.pnut.io/v0/feed/rss/posts/tags/' + name"
      class="card-link"><i
        class="fa fa-rss-square"
        aria-hidden="true"/> RSS</a>
    <list
      :data="data"
      :key="name"
      type="Post" />
  </div>
</template>

<script>
import List from '~/components/List'

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
    return {
      title: `#${this.name}`
    }
  }
}
</script>
