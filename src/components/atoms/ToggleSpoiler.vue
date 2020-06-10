<template>
  <toggle-button
    :icon="['far', 'bell']"
    text="Spoiler"
    :value="!!value"
    @input="toggle"
  />
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import ToggleButton from './ToggleButton.vue'
import { getMinimumSpoiler } from '~/util/minimum-entities'

@Component({
  components: { ToggleButton },
})
export default class ToggleSpoiler extends Vue {
  @Prop({ type: Object, required: false, default: true })
  value!: object

  toggle(state: boolean) {
    this.$emit('input', state ? getMinimumSpoiler() : null)
  }
}
</script>
