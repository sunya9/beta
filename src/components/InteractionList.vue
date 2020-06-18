<template>
  <base-list
    v-slot="{ item, lastUpdate }"
    v-bind="$attrs"
    id-field="pagination_id"
    v-on="$listeners"
  >
    <interaction
      :key="item.pagination_id"
      :interaction="item"
      :last-update="lastUpdate"
    />
  </base-list>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import BaseList from '~/components/BaseList.vue'
import Interaction from '~/components/Interaction.vue'

@Component({
  inheritAttrs: false,
  components: {
    BaseList,
    Interaction,
  },
})
export default class InteractionList extends Vue {}
</script>
