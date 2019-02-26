<template>
  <div>
    <compose v-if="user" /> <splash
      v-else
      class="mb-5"
    />
    <post-list
      ref="list"
      :data="data"
      :refresh-date="date"
      :resource="resource"
      type="Post"
    />
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import PostList from '~/components/PostList'
import { mapGetters } from 'vuex'
import { getResourcePath } from '~/plugins/axios/resources'
import Splash from '~/components/Splash'
import refreshAfterAdded from '~/assets/js/refresh-after-added'

const globalPath = getResourcePath('global')

export default {
  components: {
    Compose,
    PostList,
    Splash
  },
  mixins: [refreshAfterAdded],
  async asyncData({ app: { $resource }, store }) {
    var streamPath = '/posts/streams/me'
    if (localStorage['unified_timeline'] === 'true') {
      streamPath = '/posts/streams/unified'
    }
    const option = {
      include_directed_posts:
        localStorage['hide_directed_posts'] === 'false' ? 1 : 0
    }
    const data = await $resource(
      !store.getters.user ? globalPath : streamPath,
      option
    )
    return { data, option }
  },
  computed: {
    ...mapGetters(['user']),
    resource() {
      return !this.user ? getResourcePath('global') : ''
    }
  },
  head() {
    return {
      title: this.$store.getters.user ? 'Your Stream' : null
    }
  }
}
</script>
