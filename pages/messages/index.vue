<template>
  <div class="row">
    <div class="col-md-8">
      <h2 class="h4">Create a {{ isPrivate ? 'private message' : 'chat room' }}</h2>
      <div>
        <message-compose
          v-if="isPrivate"
          create-channel-mode />
        <channel-compose v-else />
      </div>
      <h2 class="h4">{{ isPrivate ? 'Messages' : 'Chat rooms' }}</h2>
      <ul
        v-if="isPublic"
        class="nav nav-pills my-3">
        <li class="nav-item">
          <nuxt-link
            class="nav-link"
            to="/messages?public"
            exact>Subscribed</nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link
            class="nav-link"
            to="/messages?public&amp;all">All</nuxt-link>
        </li>
      </ul>
      <list
        ref="list"
        :data="data"
        :key="JSON.stringify({ resource, option })"
        :option="option"
        :resource="resource"
        type="Channel" />
    </div>
  </div>
</template>

<script>
import MessageCompose from '~/components/MessageCompose'
import ChannelCompose from '~/components/ChannelCompose'
import List from '~/components/List'
import bus from '~/assets/js/bus'

export default {
  middleware: ['auth'],
  watchQuery: ['public', 'all'],
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
      option: {
        ...commonOption,
        channel_types: 'io.pnut.core.pm',
        is_private: 1
      }
    }
    const subscribedChatRoom = {
      resource: '/users/me/channels/subscribed',
      option: {
        ...commonOption,
        channel_types: 'io.pnut.core.chat',
        is_public: 1
      }
    }
    const allChatRoom = {
      resource: '/channels/search',
      option: {
        ...commonOption,
        channel_types: 'io.pnut.core.chat',
        is_public: 1,
        include_inactive: 1
      }
    }
    const { option, resource } = isPrivate
      ? privateMessages
      : all
        ? allChatRoom
        : subscribedChatRoom

    const data = await $resource(resource, option)
    return { data, option, isPrivate, resource }
  },
  components: {
    List,
    MessageCompose,
    ChannelCompose
  },
  computed: {
    isPublic() {
      return !this.isPrivate
    }
  },
  mounted() {
    bus.$on('channel', this.add)
  },
  beforeDestroy() {
    bus.$off('channel', this.add)
  },
  methods: {
    add() {
      this.$refs.list.refresh()
    }
  },
  head() {
    return {
      title: this.isPrivate ? 'Messages' : 'Chat Rooms'
    }
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
