<template>
  <base-list v-bind="$attrs">
    <poll
      slot-scope="{ item, index }"
      :poll="item"
      @update:data="data => $set(items, index, data)"
    />
  </base-list>
</template>
<script lang="ts">
import Vue from 'vue'
import BaseList from '~/components/BaseList.vue'
import Poll from '~/components/Poll.vue'
export default Vue.extend({
  components: {
    BaseList,
    Poll
  }
})
</script>
