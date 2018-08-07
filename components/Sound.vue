<template>
  <div class="d-flex justify-content-center align-items-center">
    <div>
      <slot>
        <strong>{{title}}</strong>
        <audio controls :src="url">Your browser does not support the <code>audio</code> element.</audio>
      </slot>
      <a @click.prevent="remove"
        v-if="removable" class="remove">
        <i class="fa fa-times"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    url: String,
    title: String,
    removable: Boolean
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
