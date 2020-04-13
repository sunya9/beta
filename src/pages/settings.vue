<template>
  <div class="card">
    <div class="card-body">
      <nuxt-child />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: ['auth'],
  head() {
    return {
      title: 'Account settings',
    }
  },
})
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.card {
  @include no-gutter-xs;
}
</style>
