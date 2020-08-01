<template>
  <base-list
    v-slot="{ item, index, lastUpdate, updateItem }"
    v-bind="$attrs"
    list-class="list-unstyled"
    @select="select = $event"
  >
    <li tabindex="-1">
      <message
        v-if="item"
        :key="item.id"
        :message.sync="item"
        :last-update="lastUpdate"
        :is-moderator="isModerator"
        :last-read-message-id="lastReadMessageId"
        :channel-type="channelType"
        class="message"
        @update:message="updateItem(index, $event)"
      />
    </li>
  </base-list>
</template>
<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import BaseList from '~/components/molecules/BaseList.vue'
import Message from '~/components/organisms/Message.vue'
import keyBinding, { forList } from '~/assets/ts/key-binding'

const keyMap = {
  del: 'removeModal',
}

@Component({
  components: {
    BaseList,
    Message,
  },
})
export default class extends Mixins(keyBinding(keyMap), forList(keyMap)) {
  @Prop({
    type: Boolean,
    default: false,
  })
  isModerator!: boolean

  @Prop({
    type: String,
    default: '',
  })
  lastReadMessageId!: string

  @Prop({
    type: String,
    default: '',
  })
  channelType!: string
}
</script>
