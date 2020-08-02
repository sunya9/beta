<template>
  <div>
    <compose />
    <post-list :list-info="listInfo" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Compose from '~/components/organisms/Compose.vue'
import PostList from '~/components/organisms/PostList.vue'
import { Post } from '~/entity/post'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  components: {
    PostList,
    Compose,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getPosts.run({
      type: 'explore',
      slug: 'trending',
    })
    return { listInfo }
  },
  head() {
    return {
      title: 'Trending',
    }
  },
})
export default class Trending extends Vue {
  listInfo!: ListInfo<Post>
}
</script>
