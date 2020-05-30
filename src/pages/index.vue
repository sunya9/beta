<template>
  <div>
    <compose v-if="user" />
    <splash v-else class="mb-5" />
    <post-list
      ref="list"
      :data="data"
      :refresh-date="date"
      :resource="resource"
      :option="options"
      type="Post"
    />
  </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import Compose from '~/components/Compose.vue'
import PostList from '~/components/PostList.vue'
import { convertPageId2ApiPath } from '~/plugins/axios/resources'
import Splash from '~/components/Splash.vue'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { User } from '~/models/user'

const globalPath = convertPageId2ApiPath('global')

@Component({
  components: {
    Compose,
    PostList,
    Splash,
  },
  async asyncData({ app: { $resource, $accessor } }) {
    let streamPath = '/posts/streams/me'
    if (localStorage.unified_timeline === 'true') {
      streamPath = '/posts/streams/unified'
    }
    const options = {
      include_directed_posts:
        localStorage.hide_directed_posts === 'false' ? 1 : 0,
    }
    const data = await $resource({
      url: !$accessor.user ? globalPath : streamPath,
      options,
    })
    return { data, options }
  },
  head(this: Index) {
    const loggedIn = !!this.$accessor.user
    return {
      title: loggedIn ? 'Your Stream' : '',
    }
  },
})
export default class Index extends Mixins(refreshAfterAdded) {
  options!: object
  data!: PnutResponse<Post[]>
  get user(): User | null {
    return this.$accessor.user
  }

  get resource(): string {
    // TODO: ?
    return !this.$accessor.user ? convertPageId2ApiPath('global') : ''
  }
}
</script>
