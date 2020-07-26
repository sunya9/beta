<template>
  <post-list v-if="listInfo" :list-info="listInfo" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PostList from '~/components/PostList.vue'
import { ListInfo } from '~/plugins/domain/util/util'
import { Post } from '~/models/post'

@Component({
  components: {
    PostList,
  },
  async asyncData(ctx) {
    const {
      params,
      app: { $interactors },
    } = ctx
    const { name } = params
    try {
      const { listInfo } = await $interactors.getPosts.run({
        type: 'bookmark',
        userId: `@${name}`,
      })
      return {
        listInfo,
        name,
      }
    } catch (e) {}
    return {
      name,
    }
  },
})
export default class extends Vue {
  name!: string
  listInfo: ListInfo<Post> | null = null
  head() {
    return {
      title: `@${this.name}'s starred`,
    }
  }
}
</script>
