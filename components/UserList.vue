<template>
  <base-list v-bind="$attrs">
    <user
      slot-scope="{ item, index }"
      :user="item"
      v-bind="componentOptions"
    />
  </base-list>
</template>
<script>
import BaseList from '~/components/BaseList'
import User from '~/components/User'

export default {
  components: {
    BaseList,
    User
  },
  props: {
    componentOptions: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
