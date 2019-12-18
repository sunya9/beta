<template>
  <div
    :class="{
      'img-thumbnail': !noBorder
    }"
    :style="style"
    class="root d-flex justify-content-center align-items-center"
  >
    <div>
      <a :href="original">
        <slot>
          <img
            :src="thumb"
            :data-original="original"
            :data-original-width="originalWidth"
            :data-original-height="originalHeight"
            alt=""
            class="thumb"
          >
        </slot>
      </a>
      <a v-if="removable" class="remove" @click.prevent="remove">
        <font-awesome-icon icon="times" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    original: {
      type: String,
      default: ''
    },
    thumb: {
      type: String,
      default: ''
    },
    originalWidth: {
      type: Number,
      default: 0
    },
    originalHeight: {
      type: Number,
      default: 0
    },
    removable: {
      type: Boolean,
      default: false
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 96
    },
    height: {
      type: Number,
      default: 96
    },
    zoomingOptions: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    normalizeOriginal(): string {
      return this.original.replace(/^https?:/, '')
    },
    normalizeThumb(): string {
      return this.thumb.replace(/^https?:/, '')
    },
    style(): { [key: string]: number | string } {
      const style: {
        [key: string]: number | string
      } = {}
      if (this.height > 0) style['max-height'] = `${this.height}px`
      if (this.width > 0) style['max-width'] = `${this.width}px`
      return style
    }
  },
  mounted() {
    const Zooming = require('zooming').default
    const img = this.$el.querySelector('img')
    if (!img) return
    const option = {
      bgColor: '#000',
      zIndex: 99999,
      bgOpacity: 0.5,
      onOpen() {
        img.classList.add('show')
      },
      onClose() {
        img.classList.remove('show')
      },
      ...this.zoomingOptions
    }
    const { customSize = {} } = this.zoomingOptions
    const root = document.documentElement
    if (
      customSize.width > root.clientWidth ||
      customSize.height > root.clientHeight
    ) {
      option.customSize = null
    }
    const zooming = new Zooming(option)
    zooming.listen(img)
  },
  methods: {
    remove() {
      this.$emit('remove')
    }
  }
})
</script>

<style scoped>
.root {
  position: relative;
  box-sizing: content-box;
}
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
