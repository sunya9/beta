<template>
  <base-list v-bind="$attrs">
    <channel
      slot-scope="{ item, index }"
      :channel="item"
      :key="item.id"
      class="list-group-item list-group-item-action"
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
  }
}
</script>
