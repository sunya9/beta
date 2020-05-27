<template>
  <div>
    <compose />
    <post-list :data="data" :refresh-date="date" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { PnutResponse } from '../models/pnut-response'
import { Post } from '../models/post'
import Compose from '~/components/Compose.vue'
import PostList from '~/components/PostList.vue'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'

@Component({
  components: {
    PostList,
    Compose,
  },
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  head() {
    return {
      title: 'Photos',
    }
  },
})
export default class extends Mixins(refreshAfterAdded) {
  data!: PnutResponse<Post[]>
}
</script>
