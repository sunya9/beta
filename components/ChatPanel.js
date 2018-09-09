import ChannelPanel from '~/components/ChannelPanel'

export default {
  extends: ChannelPanel,
  methods: {
    async memberEditModal() {
      const acl = await this.$modal.show(
        'channel-member-edit-modal',
        this.channel
      )
      if (!acl) return
      this.update({
        acl
      })
    },
    async channelEditModal() {
      const chatRawValue = await this.$modal.show(
        'channel-edit-modal',
        this.channel
      )
      if (!chatRawValue) return
      const chatRawIndex = this.channel.raw.findIndex(
        r => r.type === 'io.pnut.core.chat-settings'
      )
      if (chatRawIndex < 0) return
      if (!chatRawValue.categories.length) delete chatRawValue.categories
      const chatRaw = {
        type: 'io.pnut.core.chat-settings',
        value: chatRawValue
      }
      const raw = [...this.channel.raw]
      raw[chatRawIndex] = chatRaw
      this.$set(this.channel.raw, chatRawIndex, chatRaw)
      this.update({
        raw
      })
    },
    async update(channel) {
      try {
        const { data: response } = await this.$axios.$patch(
          `/channels/${
            this.channel.id
          }?include_channel_raw=1&include_limited_users=1`,
          channel
        )
        this.$toast.success('Updated!')
        this.channel = response
      } catch (e) {
        this.$toast.error(e.message)
      }
    }
  },
  head() {
    return {
      title: this.chat.name
    }
  }
}
