<template>
  <div
    :class="{
      'img-thumbnail': !noBorder,
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
          />
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
import { Component, Prop } from 'vue-property-decorator'

interface ZoomingOptions {
  bgColor?: string
  bgOpacity?: number
  closeOnWindowResize?: boolean
  customSize?:
    | {
        width: number
        height: number
      }
    | string
  enableGrab?: boolean
  preloadImage?: boolean
  scaleBase?: number
  scaleExtra?: number
  scrollThreshold?: number
  transitionDuration?: number
  transitionTimingFunction?: string
  zIndex?: number
  onOpen?: () => void
  onBeforeGrab?: () => void
  onGrab?: () => void
  onMove?: () => void
  onBeforeRelease?: () => void
  onRelease?: () => void
  onBeforeClose?: () => void
  onClose?: () => void
  onImageLoading?: () => void
  onImageLoadded?: () => void
}

@Component({})
export default class extends Vue {
  @Prop({
    type: String,
    default: '',
  })
  original!: string

  @Prop({
    type: String,
    default: '',
  })
  thumb!: string

  @Prop({
    type: Number,
    default: 0,
  })
  originalWidth!: number

  @Prop({
    type: Number,
    default: 0,
  })
  originalHeight!: number

  @Prop({
    type: Boolean,
    default: false,
  })
  removable!: boolean

  @Prop({
    type: Boolean,
    default: false,
  })
  noBorder!: boolean

  @Prop({
    type: Number,
    default: 96,
  })
  width!: number

  @Prop({
    type: Number,
    default: 96,
  })
  height!: number

  @Prop({
    type: Object,
    default: () => ({}),
  })
  zoomingOptions!: ZoomingOptions

  get normalizeOriginal(): string {
    return this.original.replace(/^https?:/, '')
  }

  get normalizeThumb(): string {
    return this.thumb.replace(/^https?:/, '')
  }

  get style(): { [key: string]: number | string } {
    const style: {
      [key: string]: number | string
    } = {}
    if (this.height > 0) style['max-height'] = `${this.height}px`
    if (this.width > 0) style['max-width'] = `${this.width}px`
    return style
  }

  mounted() {
    const Zooming = require('zooming').default
    const img = this.$el.querySelector('img')
    if (!img) return
    const option: ZoomingOptions = {
      bgColor: '#000',
      zIndex: 99999,
      bgOpacity: 0.5,
      onOpen() {
        img.classList.add('show')
      },
      onClose() {
        img.classList.remove('show')
      },
      ...this.zoomingOptions,
    }
    const { customSize } = this.zoomingOptions
    const root = document.documentElement
    if (
      typeof customSize !== 'string' &&
      ((customSize?.width || 0) > root.clientWidth ||
        (customSize?.height || 0) > root.clientHeight)
    ) {
      option.customSize = undefined
    }
    const zooming = new Zooming(option)
    zooming.listen(img)
  }

  remove() {
    this.$emit('remove')
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
