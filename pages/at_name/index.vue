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
        :option="option"
        :refresh-date="date"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Profile from '~/components/Profile'
import Compose from '~/components/Compose'
import PostList from '~/components/PostList'
import { getTitle, getRSSLink } from '~/assets/js/util'
import refreshAfterAdded from '~/assets/js/refresh-after-added'

export default {
  components: {
    Profile,
    Compose,
    PostList
  },
  mixins: [refreshAfterAdded],
  computed: {
    ...mapGetters(['user']),
    initialText() {
      return this.user && this.user.username === this.name
        ? ''
        : `@${this.name} `
    },
    blocked() {
      return this.profile.you_blocked
    }
  },
  watch: {
    async blocked(after, before) {
      if (before && !after) {
        await this.$nextTick()
        this.$refs.list.fetchMore()
      }
    }
  },
  async asyncData(ctx) {
    const {
      params,
      error,
      app: { $axios, $resource }
    } = ctx
    const { name } = params
    const option = {
      include_directed_posts: 1
    }
    try {
      const data = await $resource(option).catch(() => ({
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
        option
      }
    } catch (e) {
      const { meta } = e.response.data
      error({
        statusCode: meta.code,
        message: meta.error_message
      })
    }
  },
  head() {
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
