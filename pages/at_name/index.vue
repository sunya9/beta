<template>
  <div>
    <div>
      <profile :initial-profile.sync="profile" v-if="profile" class="mb-4" />
    </div>
    <div>
      <compose :initial-text="initialText" :key="`${name}-compose`" />
    </div>
    <div>
      <list :data="data" v-if="!blocked" type="Post" :key="`${name}-posts`" :option="option" ref="list" />
    </div>
  </div>
</template>

<script>
import Profile from '~/components/Profile'
import Compose from '~/components/Compose'
import List from '~/components/List'
import bus from '~/assets/js/bus'
import { mapGetters } from 'vuex'
import { getTitle } from '~/assets/js/util'

export default {
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
        data,
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
  mounted() {
    bus.$on('post', this.add)
  },
  beforeDestroy() {
    bus.$off('post', this.add)
  },
  methods: {
    add() {
      this.$refs.list.refresh()
    }
  },
  components: {
    Profile,
    Compose,
    List
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
    return {
      title,
      meta
    }
  }
}
</script>
