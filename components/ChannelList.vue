<template>
  <base-list
    v-bind="$attrs"
    :list-item-props="channel => listItemProps(channel)"
    :list-item-class="channel => listItemClass(channel)"
    list-element="nuxt-link"
  >
    <channel
      slot-scope="{ item, index }"
      :channel="item"
      :key="item.id"
      element="nuxt-link"
    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import Channel from '~/components/Channel'
export default {
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
