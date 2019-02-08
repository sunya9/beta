<template>
  <base-list
    v-bind="$attrs"
    list-class="list-unstyled"
    list-item-class="message"
    @select="select = $event"
  >
    <message
      :key="item.id"
      slot-scope="{ item, index, lastUpdate }"
      :message.sync="item"
      :last-update="lastUpdate"
      :is-moderator="isModerator"
      :last-read-message-id="lastReadMessageId"
      :channel-type="channelType"
      @update:message="$set($attrs.data.data, index, $event)"
    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import Message from '~/components/Message'
import keyBinding, { forList } from '~/assets/js/key-binding'

export default {
  keyMaps: {
    del: 'removeModal'
  },
  components: {
    BaseList,
    Message
  },
  mixins: [keyBinding, forList],
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
  }
}
</script>
