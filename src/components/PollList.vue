<template>
  <base-list v-slot="{ item, index }" v-bind="$attrs">
    <poll :poll="item" @update:data="(data) => $set(items, index, data)" />
  </base-list>
</template>
<script lang="ts">
import Vue from 'vue'
import BaseList from '~/components/BaseList.vue'
import Poll from '~/components/Poll.vue'
export default Vue.extend({
  components: {
    BaseList,
    Poll,
  },
})
</script>
