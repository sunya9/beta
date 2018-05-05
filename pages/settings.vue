<template>
  <div class="card">
    <div class="card-body">
      <nuxt-child />
    </div>
  </div>
</template>
<script>
export default {
  middleware: 'authenticated',
  head() {
    return {
      title: 'Account settings'
    }
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';

.card {
  @include no-gutter-xs;
}
</style>
