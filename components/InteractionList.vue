<template>
  <base-list
    v-bind="$attrs"
    id-field="pagination_id"
  >
    <interaction
      :key="item.pagination_id"
      slot-scope="{ item, lastUpdate }"
      :interaction="item"
      :last-update="lastUpdate"
    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import Interaction from '~/components/Interaction'

export default {
  components: {
    BaseList,
    Interaction
  }
}
</script>
