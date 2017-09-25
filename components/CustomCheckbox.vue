<template>
  <div
    class="form-check"
    :class="{
      disabled: disabled
    }">
    <label class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" @change="updateValue" :disabled="disabled" :checked="checked">
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description">
      <slot></slot>
    </span>
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
  methods: {
    updateValue(e) {
      const { checked } = e.target
      this.$emit('change', checked)
    }
  }
}
</script>
