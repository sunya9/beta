<template>
  <span
    class="position-relative"
    :class="{ 'notification-badge': $accessor.unreadMessages }"
  >
    <font-awesome-icon icon="envelope" />
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Watch } from 'nuxt-property-decorator'

@Component({})
export default class MessageIcon extends Vue {
  @Watch('$route.name', { deep: true })
  onRouteChange(newName: string) {
    if (!newName.startsWith('channels')) return
    this.$accessor.fetchUnread()
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';

.notification-badge::after {
  content: '';
  width: 0.5rem;
  height: 0.5rem;
  display: block;
  position: absolute;
  top: 0%;
  right: -4px;
  background: map-get($theme-colors, primary);
  border-radius: 50%;
}
</style>
