<template>
  <div>
    <compose />
    <post-list :list-info="listInfo" :refresh-date="date" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
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
      type: 'global',
    })
    return { listInfo }
  },
  head() {
    return {
      title: 'Global',
    }
  },
})
export default class Global extends Mixins(refreshAfterAdded) {
  listInfo!: ListInfo<Post>
}
</script>
