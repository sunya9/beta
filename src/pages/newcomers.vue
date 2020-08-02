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
import PostList from '~/components/organisms/PostList.vue'
import { ListInfo } from '~/plugins/domain/util/util'
import { Post } from '~/entity/post'

@Component({
  components: {
    PostList,
    Compose,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getPosts.run({
      type: 'explore',
      slug: 'newcomers',
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
