<template>
  <div>
    <div class="card">
      <div class="card-body">
        <image-upload />
      </div>
    </div>
  </div>
</template>

<script>
import ImageUpload from '~/components/settings/ImageUpload'
export default {
  components: {
    ImageUpload
  },
  head() {
    return {
      title: 'Stream settings'
    }
  }
}
</script>
