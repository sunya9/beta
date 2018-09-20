<template>
  <base-list
    v-bind="$attrs"
    id-field="pagination_id"
  >
    <interaction
      slot-scope="{ item, index }"
      :interaction="item"
      :key="item.pagination_id"
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
