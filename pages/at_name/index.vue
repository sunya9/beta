<template>
  <div>
    <div>
      <profile :profile="profile" class="mb-4" />
    </div>
    <div>
      <compose :initial-text="initialText" :key="`${name}-compose`" />
    </div>
    <div>
      <list :data="data" type="Post" :key="`${name}-posts`" :option="option" ref="list" />
    </div>
  </div>
</template>

<script>
import Profile from '~/components/Profile'
import Compose from '~/components/Compose'
import List from '~/components/List'
import bus from '~/assets/js/bus'
import { mapState } from 'vuex'
import { getTitle } from '~/assets/js/util'

export default {
  async asyncData(ctx) {
    const { params, error, app: { $axios, $resource } } = ctx
    const { name } = params
    const { data: profile } = await $axios.$get(`/users/@${name}`)
    const option = {
      include_directed_posts: 1
    }
    const data = await $resource(option)
    if (data.meta.code < 400) {
      return {
        data,
        profile,
        name,
        option
      }
    } else {
      error({
        statusCode: data.meta.code,
        message: data.meta.error_message
      })
    }
  },
  computed: {
    ...mapState({
      initialText(state) {
        return state.user && state.user.username === this.name
          ? ''
          : `@${this.name} `
      }
    })
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
        content: this.profile.content.text
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: this.profile.content.text
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
