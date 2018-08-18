<template>
	<div>
	  <h1 class="h3">
      Messages &middot; 
      <nuxt-link to="/messages/public">
        Public Rooms
      </nuxt-link>
    </h1>
		<div class="row">
			<div class="col-md-8">
				<h2 class="h4">
          <button type="button" class="btn btn-link" style="font-size:1.5rem" @click="toggleWhich">
            <i class="fa" :class="{'fa-toggle-on': (which == 'private message'),'fa-toggle-off': (which != 'private message')}"></i> Create a {{which}}
          </button>
        </h2>
        <transition name="fade" mode="out-in">
          <div v-if="which == 'private message'" key="pm">
            <message-compose create-channel-mode />
          </div>
          <div v-else>
  				  <channel-compose key="channel" />
          </div>
        </transition>
				<h2 class="h4">Recent messages</h2>
				<div>
          <list :data="data" type="Channel" :option="option" ref="list" />
        </div>
			</div>
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
  data() {
    return {
      which: 'private message'
    }
  },
  async asyncData({ app: { $resource } }) {
    const option = {
      include_recent_message: 1,
      channel_types: 'io.pnut.core.pm,io.pnut.core.chat',
      include_limited_users: 1,
      include_channel_raw: 1
    }
    const data = await $resource(option)
    return { data, option }
  },
  components: {
    List,
    MessageCompose,
    ChannelCompose
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
    },
    toggleWhich() {
      this.which =
        this.which == 'private message' ? 'chat room' : 'private message'
    }
  },
  head() {
    return {
      title: 'Messages'
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
