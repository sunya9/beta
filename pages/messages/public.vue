<template>
  <div>
    <h1 class="h3">
      <nuxt-link to="/messages">
        Messages
      </nuxt-link> &middot; Public Rooms
    </h1>
    <div class="row">
      <div class="col-md-8">
        <div>
          <list :data="data" type="Channel" :option="option" ref="list" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from '~/components/List'
import bus from '~/assets/js/bus'

export default {
  middleware: ['auth'],
  async asyncData({ app: { $resource } }) {
    const option = {
      include_recent_message: 1,
      channel_types: 'io.pnut.core.chat',
      include_limited_users: 1,
      include_channel_raw: 1,
      is_public: 1
    }
    const data = await $resource(option)
    return { data, option }
  },
  components: {
    List
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
      title: 'Public Rooms'
    }
  }
}
</script>
