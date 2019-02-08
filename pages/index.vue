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
    const data = await $resource(!store.getters.user ? globalPath : '')
    return { data }
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
