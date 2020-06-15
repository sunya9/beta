<template>
  <toggle-button
    icon="exclamation-circle"
    text="NSFW"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import ToggleButton from './ToggleButton.vue'

@Component({
  components: { ToggleButton },
  inheritAttrs: false,
})
export default class ToggleNsfw extends Vue {}
</script>
