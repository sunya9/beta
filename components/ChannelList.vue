<template>
  <base-list
    v-bind="$attrs"
    :list-item-props="channel => listItemProps(channel)"
    :list-item-class="channel => listItemClass(channel)"
    list-element="nuxt-link"
  >
    <channel
      :key="item.id"
      slot-scope="{ item }"
      :channel="item"
      element="nuxt-link"
    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import Channel from '~/components/Channel'
export default {
  name: 'ChannelList',
  components: {
    BaseList,
    Channel
  },
  methods: {
    listItemProps(channel) {
      return {
        to: `/messages/${channel.id}`
      }
    },
    listItemClass(channel) {
      return [
        'list-group-item list-group-item-action',
        {
          'unread-channel': channel.has_unread
        }
      ]
    }
  }
}
</script>
