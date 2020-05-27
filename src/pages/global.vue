<template>
  <div>
    <compose />
    <post-list :data="data" :option="options" :refresh-date="date" />
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
  middleware: ['auth'],
  components: {
    PostList,
    Compose,
  },
  async asyncData({ app: { $resource } }) {
    const options = {
      include_directed_posts:
        localStorage.hide_directed_posts === 'true' ? 0 : 1,
    }
    const data = await $resource({ options })
    return { data, options }
  },
  head() {
    return {
      title: 'Global',
    }
  },
})
export default class extends Mixins(refreshAfterAdded) {
  data!: PnutResponse<Post[]>
  options!: object
}
</script>
