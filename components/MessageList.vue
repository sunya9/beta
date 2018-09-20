<template>
  <base-list
    v-bind="$attrs"
    default-classes="list-unstyled"
  >
    <message
      slot-scope="{ item, index }"
      :key="item.id"
      :message.sync="item"
      :is-moderator="isModerator"
      :last-read-message-id="lastReadMessageId"
      :channel-type="channelType"
      @update:message="$set($attrs.data.data, index, $event)"
    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import Mousetrap from '~/plugins/mousetrap'
import Message from '~/components/Message'

export default {
  components: {
    BaseList,
    Message
  },
  props: {
    isModerator: {
      type: Boolean,
      default: false
    },
    lastReadMessageId: {
      type: String,
      default: ''
    },
    channelType: {
      type: String,
      default: ''
    }
  },
  mounted() {
    Mousetrap.bind('del', this.remove)
  },
  beforeDestroy() {
    Mousetrap.unbind('del')
  },
  methods: {
    remove() {
      if (!this.selectItem || !this.selectItem.me) return
      this.selectItem.removeModal()
    }
  }
}
</script>
