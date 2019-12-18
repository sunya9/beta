<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'loading',
  mounted() {
    this.$router.replace('/')
  }
})
</script>
