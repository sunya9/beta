<template>
  <div class="row">
    <div class="col-md-8">
      <h2 class="h4">
        Create a {{ isPrivate ? 'private message' : 'chat room' }}
      </h2>
      <div>
        <message-compose v-if="isPrivate" create-channel-mode />
        <channel-compose v-else />
      </div>
      <h2 class="h4">
        {{ isPrivate ? 'Messages' : 'Chat rooms' }}
      </h2>
      <ul v-if="isPublic" class="nav nav-pills my-3">
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/channels?public" exact>
            Subscribed
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/channels?public&amp;all">
            All
          </nuxt-link>
        </li>
      </ul>
      <channel-list :list-info="listInfo" :refresh-date="date" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { Mixins } from 'vue-property-decorator'
import { Channel } from '~/models/channel'
import MessageCompose from '~/components/organisms/MessageCompose.vue'
import ChannelCompose from '~/components/ChannelCompose.vue'
import ChannelList from '~/components/ChannelList.vue'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  middleware: ['auth'],
  watchQuery: ['public', 'all'],
  components: {
    ChannelList,
    MessageCompose,
    ChannelCompose,
  },
  async asyncData({ app: { $interactors }, query }) {
    const isPrivate = !('public' in query)
    const all = 'all' in query
    const { listInfo } = await $interactors.getChannels.run({
      isPrivate,
      all,
      params: {
        include_recent_message: true,
        include_limited_users: true,
        include_channel_raw: true,
      },
    })
    return { isPrivate, listInfo }
  },
  head(this: Messages) {
    return {
      title: this.isPrivate ? 'Messages' : 'Chat Rooms',
    }
  },
})
export default class Messages extends Mixins(refreshAfterAdded) {
  listInfo!: ListInfo<Channel>
  isPrivate!: boolean
  get isPublic(): boolean {
    return !this.isPrivate
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter, .fade-leave-to
/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
