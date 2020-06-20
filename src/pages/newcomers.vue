<template>
  <div>
    <compose />
    <post-list :list-info="listInfo" disable-auto-refresh />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Compose from '~/components/organisms/Compose.vue'
import PostList from '~/components/PostList.vue'
import { ListInfo } from '~/plugins/domain/util/util'
import { Post } from '~/models/post'

@Component({
  components: {
    PostList,
    Compose,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getPosts.run({
      streamType: { type: 'explore', slug: 'newcomers' },
      params: {
        include_directed_posts: localStorage.hide_directed_posts === 'false',
      },
    })
    return { listInfo }
  },
  head() {
    return {
      title: 'Newcomers',
    }
  },
})
export default class Newcomers extends Vue {
  listInfo!: ListInfo<Post>
}
</script>
