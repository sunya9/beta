<template>
  <button class="open-emoji-picker text-dark">
    <font-awesome-icon :icon="['far', 'smile']" size="lg" />
  </button>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
@Component
export default class EmojiButton extends Vue {}
</script>
<style scoped>
.open-emoji-picker {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  border: 0;
  padding: 0;
  margin: 0;
  background: none;
  color: inherit;
}
</style>
