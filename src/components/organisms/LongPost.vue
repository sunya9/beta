<template>
  <div class="my-2">
    <button
      :class="{
        'btn-link': visibility,
        'btn-outline-primary': !visibility,
      }"
      class="btn mb-2"
      data-test-collapse-button
      type="button"
      @click="toggle"
    >
      <font-awesome-icon
        :icon="!visibility ? 'plus' : 'minus'"
        aria-hidden="true"
      />
      <span v-if="!visibility">Expand Post</span>
      <span v-else>Collapse Post</span>
    </button>
    <div v-if="visibility" class="mt-2 longpost">
      <emojify v-if="longPost.title" :text="longPost.title" element="h5" />
      <emojify :text="longPost.body" element="p" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { LongPost } from '~/entity/raw/raw/long-post'

export default defineComponent({
  props: {
    longPost: {
      type: Object as () => LongPost,
      required: true,
    },
  },
  setup() {
    const visibility = ref(false)
    const toggle = () => (visibility.value = !visibility.value)
    return {
      visibility,
      toggle,
    }
  },
})
</script>

<style scoped>
.longpost {
  white-space: pre-wrap;
}
</style>
