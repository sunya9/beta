<template>
  <div>
    <div>
      <profile v-if="profile" :initial-profile.sync="profile" class="mb-4" />
    </div>
    <div>
      <compose :key="`${uniqueName}-compose`" :initial-text="initialText" />
    </div>
    <div>
      <post-list
        v-if="!blocked"
        ref="list"
        :key="`${uniqueName}-posts`"
        :data="data"
        :option="options"
        :refresh-date="date"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import Profile from '~/components/Profile.vue'
import Compose from '~/components/Compose.vue'
import PostList from '~/components/PostList.vue'
import { getTitle, getRSSLink } from '~/assets/ts/util'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { User } from '~/models/user'

@Component({
  components: {
    Profile,
    Compose,
    PostList,
  },
  async asyncData(ctx) {
    const {
      params,
      error,
      app: { $axios, $resource },
    } = ctx
    const { name } = params
    const options = {
      include_directed_posts: 1,
    }
    try {
      const data = await $resource({ options }).catch(() => ({
        meta: { code: 404 },
      }))
      const { data: profile } = await $axios.$get(`/users/@${name}`)
      return {
        data: data || {
          meta: {},
          data: [],
        },
        profile,
        uniqueName: name,
        options,
      }
    } catch (e) {
      const { meta } = e.response.data
      error({
        statusCode: meta.code,
        message: meta.error_message,
      })
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
        content: this.uniqueName,
      },
    ]
    const link = [
      getRSSLink(
        `https://api.pnut.io/v0/feed/rss/users/@${this.uniqueName}/posts`
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
  uniqueName!: string
  data!: PnutResponse<Post[]>
  options!: object
  $refs!: {
    list: any
  }

  get user(): User | null {
    return this.$accessor.user
  }

  get initialText(): string {
    return this.user && this.user.username === this.uniqueName
      ? ''
      : `@${this.uniqueName} `
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
