<template>
  <div class="root img-thumbnail d-flex justify-content-center align-items-center">
    <div>
      <a :href="original">
        <img :src="thumb" alt="" class="thumb">
      </a>
      <a  @click.prevent="remove"
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
    removable: Boolean
  },
  mounted () {
    const Zooming = require('zooming')
    const img = this.$el.querySelector('img')
    const zooming = new Zooming({
      bgColor: '#000',
      zIndex: 1040,
      bgOpacity: 0.5,
      onOpen () {
        img.classList.add('show')
      },
      onClose () {
        img.classList.remove('show')
      }
    })
    zooming.listen(img)
  },
  computed: {
    normalizeOriginal () {
      return this.original.replace(/^https?:/, '')
    },
    normalizeThumb () {
      return this.thumb.replace(/^https?:/, '')
    }
  },
  methods: {
    remove () {
      this.$emit('remove')
    }
  }
}
</script>

<style scoped>
.root {
  position: relative;
  max-height: 96px;
  max-width: 96px;
  box-sizing: content-box;
}
.remove {
  position: absolute;
  top: .5rem;
  right: .5rem;
  overflow: hidden;
  padding: .3rem;
  line-height: 1;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #aaa;
}
.thumb {
  max-height: 96px;
  max-width: 96px;
}
</style>