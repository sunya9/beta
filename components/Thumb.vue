<template>
  <div class="root d-flex justify-content-center align-items-center"
    :class="{
      'img-thumbnail': !noBorder
    }"
    :style="style"
    >
    <div>
      <a :href="original">
        <slot>
          <img :src="thumb" :data-original="original" :data-original-width="originalWidth" :data-original-height="originalHeight" alt="" class="thumb">
        </slot>
      </a>
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
    original: String,
    thumb: String,
    originalWidth: Number,
    originalHeight: Number,
    removable: Boolean,
    noBorder: Boolean,
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
  mounted() {
    const Zooming = require('zooming').default
    const img = this.$el.querySelector('img')
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
  computed: {
    normalizeOriginal() {
      return this.original.replace(/^https?:/, '')
    },
    normalizeThumb() {
      return this.thumb.replace(/^https?:/, '')
    },
    style() {
      const style = {}
      if (this.height > 0) style['max-height'] = `${this.height}px`
      if (this.width > 0) style['max-width'] = `${this.width}px`
      return style
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
