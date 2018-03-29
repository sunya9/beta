<template>
  <div>
    <div class="card">
      <div class="card-body">
        <file-list :data="data" />
      </div>
    </div>
  </div>
</template>
<script>
import FileList from '~/components/file-list'

export default {
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return {
      data
    }
  },
  head() {
    return {
      title: 'Your files'
    }
  },
  components: {
    FileList
  }
}
</script>
