<template>
  <base-list v-slot="{ item, lastUpdate }" v-bind="$attrs" v-on="$listeners">
    <li
      :key="item.pagination_id"
      tabindex="-1"
      class="list-group-item list-group-item-action"
    >
      <interaction
        :key="item.pagination_id"
        :interaction="item"
        :last-update="lastUpdate"
      />
    </li>
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
