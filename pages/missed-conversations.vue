<template>
  <div>
    <div>
      <compose />
    </div>
    <div>
      <list
        ref="list"
        :data="data"
        :option="option"
        :auto-refresh="false"
        type="Post" />
    </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'

export default {
  async asyncData({ app: { $resource } }) {
    const option = {
      include_directed_posts: 1
    }
    const data = await $resource(option)
    return { data, option }
  },
  components: {
    List,
    Compose
  },
  head() {
    return {
      title: 'Missed Conversations'
    }
  }
}
</script>
