<template>
  <toggle-button icon="plus" text="Long" :value="!!value" @input="toggle" />
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import ToggleButton from './ToggleButton.vue'
import { getMinimumLongPost } from '~/util/minimum-entities'

@Component({
  components: { ToggleButton },
})
export default class ToggleLongpost extends Vue {
  @Prop({ type: Object, required: false, default: true })
  value!: object

  toggle(state: boolean) {
    this.$emit('input', state ? getMinimumLongPost() : null)
  }
}
</script>
