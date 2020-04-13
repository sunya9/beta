<template>
  <base-list v-bind="$attrs">
    <user slot-scope="{ item }" :user="item" v-bind="componentOptions" />
  </base-list>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import BaseList from '~/components/BaseList.vue'
import User from '~/components/User.vue'

@Component({
  components: {
    BaseList,
    User,
  },
})
export default class extends Vue {
  @Prop({ type: Object })
  componentOptions!: object
}
</script>
