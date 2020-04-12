<template>
  <base-list
    v-bind="$attrs"
    list-class="list-unstyled"
    list-item-class="message"
  >
    <message
      v-if="item"
      :key="item.id"
      slot-scope="{ item, index, lastUpdate, updateItem }"
      :message.sync="item"
      :last-update="lastUpdate"
      :is-moderator="isModerator"
      :last-read-message-id="lastReadMessageId"
      :channel-type="channelType"
      @update:message="updateItem(index, $event)"
    />
  </base-list>
</template>
<script lang="ts">
import Vue from 'vue'
import BaseList from '~/components/BaseList.vue'
import Message from '~/components/Message.vue'
import keyBinding, { forList } from '~/assets/ts/key-binding'

const keyMap = {
  del: 'removeModal',
}

export default Vue.extend({
  components: {
    BaseList,
    Message,
  },
  mixins: [keyBinding(keyMap), forList(keyMap)],
  props: {
    isModerator: {
      type: Boolean,
      default: false,
    },
    lastReadMessageId: {
      type: String,
      default: '',
    },
    channelType: {
      type: String,
      default: '',
    },
  },
})
</script>
