<template>
  <div>
    <compose />
    <post-list :refresh-date="date" :list-info="listInfo" />
  </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { Post } from '~/models/post'
import Compose from '~/components/organisms/Compose.vue'
import PostList from '~/components/PostList.vue'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  middleware: ['auth'],
  components: {
    PostList,
    Compose,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getPosts.run({
      type: 'mentions',
      params: {
        include_directed_posts: localStorage.hide_directed_posts === 'true',
      },
    })
    return { listInfo }
  },
  head() {
    return {
      title: 'Mentions',
    }
  },
})
export default class extends Mixins(refreshAfterAdded) {
  listInfo!: ListInfo<Post>
}
</script>
