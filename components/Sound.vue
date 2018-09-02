<template>
  <div class="d-flex justify-content-center align-items-center">
    <div>
      <slot>
        <strong>{{ title }}</strong>
        <audio
          :src="url"
          controls>Your browser does not support the <code>audio</code> element.</audio>
      </slot>
      <a
        v-if="removable"
        class="remove"
        @click.prevent="remove">
        <font-awesome-icon icon="times"/>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    removable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    remove() {
      this.$emit('remove')
    }
  }
}
</script>

<style scoped>
.remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  overflow: hidden;
  padding: 0.3rem;
  line-height: 1;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #aaa;
}
</style>
