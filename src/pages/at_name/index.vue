<template>
  <div>
    <compose
      v-if="listInfo"
      :key="`${$route.params.name}-compose`"
      :initial-text="initialText"
    />
    <post-list
      v-if="listInfo"
      :key="`${$route.params.name}-posts`"
      :list-info="listInfo"
      :refresh-date="date"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Post } from '~/entity/post'
import Profile from '~/components/organisms/Profile.vue'
import Compose from '~/components/organisms/Compose.vue'
import PostList from '~/components/organisms/PostList.vue'
import { getRSSLink } from '~/assets/ts/util'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { User } from '~/entity/user'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  components: {
    Profile,
    Compose,
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
        type: 'user',
        userId: `@${name}`,
        params: {
          include_directed_posts: true,
        },
      })
      return {
        listInfo,
        uniqueName: name,
      }
    } catch (e) {}
    return {
      uniqueName: name,
    }
  },
  head(this: Index) {
    const link = [
      getRSSLink(
        `https://api.pnut.io/v0/feed/rss/users/@${this.$route.params.name}/posts`
      ),
    ]
    return {
      link,
    }
  },
})
export default class Index extends Mixins(refreshAfterAdded) {
  listInfo: ListInfo<Post> | null = null

  get user(): User | null {
    return this.$accessor.user
  }

  get initialText(): string {
    return this.user?.username === this.$route.params.name
      ? ''
      : `@${this.$route.params.name} `
  }
}
</script>
