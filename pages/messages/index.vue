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
          <nuxt-link class="nav-link" to="/messages?public" exact>
            Subscribed
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/messages?public&amp;all">
            All
          </nuxt-link>
        </li>
      </ul>
      <channel-list
        ref="list"
        :key="JSON.stringify({ resource, option })"
        :data="data"
        :option="options"
        :resource="resource"
        :refresh-date="date"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MessageCompose from '~/components/MessageCompose.vue'
import ChannelCompose from '~/components/ChannelCompose.vue'
import ChannelList from '~/components/ChannelList.vue'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'

export default Vue.extend({
  middleware: ['auth'],
  watchQuery: ['public', 'all'],
  components: {
    ChannelList,
    MessageCompose,
    ChannelCompose
  },
  mixins: [refreshAfterAdded],

  // TODO
  data() {
    return {
      isPrivate: false
    }
  },
  computed: {
    isPublic(): boolean {
      return !this.isPrivate
    }
  },
  async asyncData({ app: { $resource }, query }) {
    const isPrivate = !('public' in query)
    const all = 'all' in query
    const commonOption = {
      include_recent_message: 1,
      include_limited_users: 1,
      include_channel_raw: 1
    }
    const privateMessages = {
      resource: '/users/me/channels/subscribed',
      options: {
        ...commonOption,
        channel_types: 'io.pnut.core.pm',
        is_private: 1
      }
    }
    const subscribedChatRoom = {
      resource: '/users/me/channels/subscribed',
      options: {
        ...commonOption,
        channel_types: 'io.pnut.core.chat',
        is_public: 1
      }
    }
    const allChatRoom = {
      resource: '/channels/search',
      options: {
        ...commonOption,
        channel_types: 'io.pnut.core.chat',
        is_public: 1,
        include_inactive: 1
      }
    }
    const { options, resource } = isPrivate
      ? privateMessages
      : all
      ? allChatRoom
      : subscribedChatRoom

    const data = await $resource({
      url: resource,
      options
    })
    return { data, options, isPrivate, resource }
  },
  head() {
    // TODO
    return {
      title: (this as any).isPrivate ? 'Messages' : 'Chat Rooms'
    }
  }
})
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
