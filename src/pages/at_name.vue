<template>
  <div>
    <profile v-if="profile" :initial-profile.sync="profile" class="mb-4" />
    <nuxt-child />
  </div>
</template>
<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import Profile from '~/components/Profile.vue'
import Compose from '~/components/organisms/Compose.vue'
import PostList from '~/components/PostList.vue'
import { getTitle } from '~/assets/ts/util'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { User } from '~/models/user'

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
    const { user } = await $interactors.getProfileWithPosts.run({
      username: `@${name}`,
      postParams: {
        include_directed_posts: true,
      },
    })
    return {
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
    return {
      title,
      meta,
    }
  },
})
export default class Index extends Mixins(refreshAfterAdded) {
  profile!: User

  get blocked(): boolean {
    return this.profile.you_blocked
  }

  @Watch('blocked')
  async onBlockedChange(after: boolean, before: boolean) {
    if (before && !after) {
      await this.$nextTick()
      // TODO
      // this.$refs.list.fetchMore()
    }
  }
}
</script>
