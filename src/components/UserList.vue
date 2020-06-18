<template>
  <base-list v-slot="{ item }" v-bind="$attrs" v-on="$listeners">
    <user :user="item" v-bind="componentOptions" />
  </base-list>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import BaseList from '~/components/BaseList.vue'
import User from '~/components/molecules/User.vue'

@Component({
  inheritAttrs: false,
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
