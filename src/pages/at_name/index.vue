<template>
  <div>
    <div>
      <profile v-if="profile" :initial-profile.sync="profile" class="mb-4" />
    </div>
    <div>
      <compose
        :key="`${$route.params.name}-compose`"
        :initial-text="initialText"
      />
    </div>
    <div>
      <post-list
        v-if="!blocked"
        ref="list"
        :key="`${$route.params.name}-posts`"
        :list-info="listInfo"
        :refresh-date="date"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { Post } from '~/models/post'
import Profile from '~/components/Profile.vue'
import Compose from '~/components/organisms/Compose.vue'
import PostList from '~/components/PostList.vue'
import { getTitle, getRSSLink } from '~/assets/ts/util'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { User } from '~/models/user'
import { ListInfo } from '~/plugins/domain/usecases/getList'

@Component({
  components: {
    Profile,
    Compose,
    PostList,
  },
  validate({ params: { name } }) {
    return /^\w+$/.test(name)
  },
  async asyncData(ctx) {
    const {
      params,
      app: { $interactors },
    } = ctx
    const { name } = params
    const { listInfo, user } = await $interactors.getProfileWithPosts.run({
      username: `@${name}`,
      postParams: {
        include_directed_posts: true,
      },
    })
    return {
      listInfo,
      profile: user.data,
      uniqueName: name,
    }
  },
  head(this: Index) {
    const title = getTitle(this.profile)
    const meta = [
      {
        hid: 'description',
        name: 'description',
        content: this.profile.content?.text || '',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: this.profile.content?.text || '',
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'profile',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: title,
      },
      {
        property: 'profile:username',
        content: this.$route.params.name,
      },
    ]
    const link = [
      getRSSLink(
        `https://api.pnut.io/v0/feed/rss/users/@${this.$route.params.name}/posts`
      ),
    ]
    return {
      title,
      meta,
      link,
    }
  },
})
export default class Index extends Mixins(refreshAfterAdded) {
  profile!: User
  listInfo!: ListInfo<Post>
  $refs!: {
    list: any
  }

  get user(): User | null {
    return this.$accessor.user
  }

  get initialText(): string {
    return this.user?.username === this.$route.params.name
      ? ''
      : `@${this.$route.params.name} `
  }

  get blocked(): boolean {
    return this.profile.you_blocked
  }

  @Watch('blocked')
  async onBlockedChange(after: boolean, before: boolean) {
    if (before && !after) {
      await this.$nextTick()
      // TODO
      this.$refs.list.fetchMore()
    }
  }
}
</script>
