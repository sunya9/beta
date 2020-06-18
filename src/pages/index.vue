<template>
  <div>
    <compose v-if="$auth.loggedIn" />
    <splash v-else class="mb-5" />
    <post-list :list-info="listInfo" :refresh-date="date" />
  </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ListInfo } from '~/plugins/domain/usecases/getList'
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
  async asyncData({ $auth, app: { $interactors } }) {
    const unified = localStorage.unified_timeline === 'true'
    const streamType: StreamType = $auth.loggedIn
      ? { type: 'home', unified }
      : { type: 'global' }
    const { listInfo } = await $interactors.getPosts.run({
      streamType,
      params: {
        include_directed_posts: localStorage.hide_directed_posts === 'false',
      },
    })
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
}
</script>
