<template>
  <img class="thumbnail" />
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ThumbnailImage',
})
</script>
<style scoped>
.thumbnail {
  object-fit: cover;
  max-width: 100px;
  max-height: 100px;
  margin: auto;
}
</style>
