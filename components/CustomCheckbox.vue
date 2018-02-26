<template>
  <div class="custom-control custom-checkbox">
    <input
      type="checkbox"
      :id="id"
      class="custom-control-input"
      @change="updateValue"
      :disabled="disabled"
      :checked="checked">
    <label :for="id" class="custom-control-label">
      <slot />
    </label>
  </div>
</template>
<script>
export default {
  props: ['disabled', 'checked'],
  model: {
    prop: 'checked',
    event: 'change'
  },
  data() {
    return {
      id: `checkbox-${Math.random()}`
    }
  },
  methods: {
    updateValue(e) {
      const { checked } = e.target
      this.$emit('change', checked)
    }
  }
}
</script>
