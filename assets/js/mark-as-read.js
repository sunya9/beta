// need channel data
export default {
  methods: {
    async markAsRead() {
      if (!this.channel.has_unread) return false
      const marker = [
        {
          name: `channel:${this.channel.id}`,
          id: this.channel.recent_message_id
        }
      ]
      // this.channel.has_unread
      try {
        await this.$axios.$post('/markers', marker)
        this.$toast.success('Marked as read!')
        this.channel.has_unread = false
      } catch (e) {
        this.$toast.error(e.message)
      }
    }
  }
}
