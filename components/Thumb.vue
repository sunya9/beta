<template>
  <a :href="original">
    <img :src="thumb" alt="" class="img-thumbnail">
  </a>
</template>

<script>
export default {
  props: ['original', 'thumb'],
  mounted() {
    if(process.BROWSER_BUILD) {
      const Zooming = require('zooming')
      const zooming = new Zooming({
        bgColor: '#000',
        zIndex: 2000,
        bgOpacity: .5
      })
      zooming.listen(this.$el.querySelector('img'))
    }
  },
  computed: {
    normalizeOriginal() {
      return this.original.replace(/^https?:/, '')
    },
    normalizeThumb() {
      return this.thumb.replace(/^https?:/, '')
    }
  }
}
</script>

<style scoped>
.img-thumbnail {
  max-height: 96px;
  max-width: 96px;
}
</style>