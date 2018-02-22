<template>
  <div>
    <div class="card">
      <div class="card-body">
        <display />
      </div>
    </div>
  </div>
</template>

<script>
import Display from '~/components/settings/Display'
export default {
  components: {
    Display
  },
  head() {
    return {
      title: 'Display settings'
    }
  }
}
</script>
