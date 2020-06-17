<template>
  <base-list
    v-slot="{ item }"
    v-bind="$attrs"
    :list-item-props="(channel) => listItemProps(channel)"
    :list-item-class="(channel) => listItemClass(channel)"
    list-element="nuxt-link"
  >
    <channel :key="item.id" :channel="item" element="nuxt-link" />
  </base-list>
</template>
<script lang="ts">
import Vue from 'vue'
import { Channel } from '~/models/channel'
import BaseList from '~/components/BaseList.vue'
import ChannelView from '~/components/molecules/Channel.vue'
export default Vue.extend({
  name: 'ChannelList',
  components: {
    BaseList,
    Channel: ChannelView,
  },
  methods: {
    listItemProps(channel: Channel) {
      return {
        to: `/channels/${channel.id}`,
      }
    },
    listItemClass(channel: Channel) {
      return [
        'list-group-item list-group-item-action',
        {
          'unread-channel': channel.has_unread,
        },
      ]
    },
  },
})
</script>
