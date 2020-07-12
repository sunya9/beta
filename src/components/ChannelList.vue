<template>
  <base-list
    v-slot="{ item }"
    v-bind="$attrs"
    tag="div"
    list-element="div"
    v-on="$listeners"
    @select="select = $event"
  >
    <nuxt-link
      :to="`/channels/${item.id}`"
      tabindex="-1"
      class="list-group-item list-group-item-action"
      :class="{ 'list-group-item-primary': item.has_unread }"
    >
      <channel :key="item.id" :channel="item" />
    </nuxt-link>
  </base-list>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Channel } from '~/models/channel'
import BaseList from '~/components/BaseList.vue'
import ChannelView from '~/components/molecules/Channel.vue'
import keyBinding, { forList } from '~/assets/ts/key-binding'

const keyMap = {
  enter: 'goToChannel',
}

@Component({
  components: {
    BaseList,
    Channel: ChannelView,
  },
})
export default class ChannelList extends Mixins(
  keyBinding(keyMap),
  forList(keyMap)
) {
  listItemProps(channel: Channel) {
    return {
      to: `/channels/${channel.id}`,
    }
  }

  listItemClass(channel: Channel) {
    return [
      'list-group-item list-group-item-action',
      {
        'unread-channel': channel.has_unread,
      },
    ]
  }
}
</script>
