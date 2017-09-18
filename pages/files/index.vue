<template>
  <div>
    <h3 class="mb-4">Your files</h3>
    <div class="card">
      <div class="card-body">
        <file-list :data="data" />
      </div>
    </div>
  </div>
</template>
<script>
import api from '~plugins/api'
import FileList from '~components/file-list'

export default {
  async asyncData (ctx) {
    const data = await api(ctx).fetch()
    return {
      data
    }
  },
  head () {
    return {
      title: 'Your files'
    }
  },
  components: {
    FileList
  }
}
</script>
