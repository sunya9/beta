<template>
  <base-list v-bind="$attrs" id-field="pagination_id">
    <interaction
      :key="item.pagination_id"
      slot-scope="{ item, lastUpdate }"
      :interaction="item"
      :last-update="lastUpdate"
    />
  </base-list>
</template>
<script lang="ts">
import Vue from 'vue'
import BaseList from '~/components/BaseList.vue'
import Interaction from '~/components/Interaction.vue'

export default Vue.extend({
  components: {
    BaseList,
    Interaction,
  },
})
</script>
