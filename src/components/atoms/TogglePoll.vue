<template>
  <toggle-button
    icon="chart-bar"
    text="Poll"
    :value="!!value"
    @input="toggle"
  />
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import ToggleButton from './ToggleButton.vue'
import { getMinimumPoll } from '~/util/minimum-entities'

@Component({
  components: { ToggleButton },
})
export default class ToggleSpoiler extends Vue {
  @Prop({ type: Object, required: false, default: null })
  value!: object | null

  toggle(state: boolean) {
    this.$emit('input', state ? getMinimumPoll() : null)
  }
}
</script>
