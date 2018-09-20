<template>
  <base-list v-bind="$attrs">
    <poll
      slot-scope="{ item, index }"
      :poll="item"
      @update:data="data => $set(items, index, data)"
    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import Poll from '~/components/Poll'
export default {
  components: {
    BaseList,
    Poll
  }
}
</script>
