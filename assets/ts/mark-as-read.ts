import Vue from 'vue'
import { Channel } from '~/models/channel'

// need channel data
export default Vue.extend({
  methods: {
    async markAsRead() {
      const channel = (this as any).channel as Channel
      if (!channel.has_unread) return false
      const marker = [
        {
          name: `channel:${channel.id}`,
          id: channel.recent_message_id,
        },
      ]
      // channel.has_unread
      try {
        await this.$axios.$post('/markers', marker)
        this.$toast.success('Marked as read!')
        channel.has_unread = false
      } catch (e) {
        this.$toast.error(e.message)
      }
    },
  },
})
