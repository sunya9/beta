<template>
  <div>
    <div>
      <profile v-if="profile" :initial-profile.sync="profile" class="mb-4" />
    </div>
    <div>
      <compose :key="`${name}-compose`" :initial-text="initialText" />
    </div>
    <div>
      <post-list
        v-if="!blocked"
        ref="list"
        :key="`${name}-posts`"
        :data="data"
        :option="options"
        :refresh-date="date"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
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
    PostList
  },
  mixins: [refreshAfterAdded],
  async asyncData(ctx) {
    const {
      params,
      error,
      app: { $axios, $resource }
    } = ctx
    const { name } = params
    const options = {
      include_directed_posts: 1
    }
    try {
      const data = await $resource({ options }).catch(() => ({
        meta: { code: 404 }
      }))
      const { data: profile } = await $axios.$get(`/users/@${name}`)

      return {
        data: data || {
          meta: {},
          data: []
        },
        profile,
        name,
        options
      }
    } catch (e) {
      const { meta } = e.response.data
      error({
        statusCode: meta.code,
        message: meta.error_message
      })
    }
  }
})
export default class extends Vue {
  @Prop({ type: Object, required: true })
  profile!: User
  @Prop({ type: String, required: true })
  name!: string
  $refs!: {
    list: any
  }
  get user(): User | null {
    return this.$store.state.user
  }
  get initialText(): string {
    return this.user && this.user.username === this.name ? '' : `@${this.name} `
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
  head() {
    if (!this.profile) return {}
    const title = getTitle(this.profile)
    const meta = [
      {
        hid: 'description',
        name: 'description',
        content:
          this.profile && this.profile.content && this.profile.content.text
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          this.profile && this.profile.content && this.profile.content.text
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'profile'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: title
      },
      {
        property: 'profile:username',
        content: this.name
      }
    ]
    const link = [
      getRSSLink(`https://api.pnut.io/v0/feed/rss/users/@${this.name}/posts`)
    ]
    return {
      title,
      meta,
      link
    }
  }
}
</script>
