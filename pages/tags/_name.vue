<template>
  <div>
    <h3 v-emojify>#{{name}}</h3>
    <a class="card-link" :href="'https://api.pnut.io/v0/feed/rss/posts/tags/' + name"><i class="fa fa-rss-square" aria-hidden="true"></i> RSS</a>
    <list :data="data" type="Post" :key="name" />
  </div>
</template>

<script>
import api from '~/plugins/api'
import List from '~/components/List'

export default {
  async asyncData(ctx) {
    const { params } = ctx
    const { name } = params
    const data = await api(ctx).fetch()
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
