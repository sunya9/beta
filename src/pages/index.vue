<template>
  <div>
    <compose v-if="$auth.loggedIn" />
    <splash v-else class="mb-5" />
    <post-list :list-info="listInfo" :refresh-date="date" />
  </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { Watch } from 'nuxt-property-decorator'
import { ListInfo } from '~/plugins/domain/util/util'
import { StreamType } from '~/plugins/domain/dto/streamType'
import { Post } from '~/models/post'
import Compose from '~/components/organisms/Compose.vue'
import PostList from '~/components/PostList.vue'
import Splash from '~/components/Splash.vue'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'

@Component({
  components: {
    Compose,
    PostList,
    Splash,
  },
  async asyncData({ $auth, app: { $interactors, $accessor } }) {
    const unified = localStorage.unified_timeline === 'true'
    const streamType: StreamType = $auth.loggedIn
      ? { type: 'home', unified }
      : { type: 'global' }
    const { listInfo } = await $interactors.getPosts.run({
      ...streamType,
      params: {
        include_marker: true,
      },
    })
    if ($auth.loggedIn) {
      $accessor.updateUnreadHomeStream(false)
    }
    return {
      listInfo,
    }
  },
  head(this: Index) {
    return {
      title: this.$auth.loggedIn ? 'Your Stream' : '',
    }
  },
})
export default class Index extends Mixins(refreshAfterAdded) {
  listInfo!: ListInfo<Post>
  @Watch('$accessor.unreadHomeStream')
  onChangeUnreadHomeStream() {
    this.$accessor.updateUnreadHomeStream(false)
  }

  mounted() {
    this.markAsRead()
  }

  markAsRead() {
    const id = this.listInfo.newerMeta.max_id
    if (!id) return
    this.$interactors.markAsRead.run({
      type: 'personal',
      id,
    })
  }
}
</script>
