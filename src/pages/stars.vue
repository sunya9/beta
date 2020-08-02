<template>
  <div>
    <div>
      <compose />
    </div>
    <div>
      <post-list :list-info="listInfo" />
    </div>
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
  middleware: ['auth'],
  components: {
    PostList,
    Compose,
  },
  async asyncData({ app: { $interactors } }) {
    const { listInfo } = await $interactors.getPosts.run({
      type: 'bookmark',
      userId: 'me',
    })
    return { listInfo }
  },
  head() {
    return {
      title: 'Stars',
    }
  },
})
export default class Stars extends Vue {
  listInfo!: ListInfo<Post>
}
</script>
