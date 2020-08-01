<template>
  <base-list v-slot="{ item, index }" v-bind="$attrs">
    <li class="list-group-item list-group-item-action" tabindex="-1">
      <poll :poll="item" @update:data="(data) => $set(items, index, data)" />
    </li>
  </base-list>
</template>
<script lang="ts">
import Vue from 'vue'
import BaseList from '~/components/molecules/BaseList.vue'
import Poll from '~/components/organisms/Poll.vue'
export default Vue.extend({
  components: {
    BaseList,
    Poll,
  },
})
</script>
