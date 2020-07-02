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

@Component({})
export default class MessageIcon extends Vue {}
</script>
<style scoped lang="scss">
@import '~assets/css/override';

.notification-badge::after {
  top: 0%;
  right: -4px;
}
</style>
