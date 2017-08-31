<template>
  <div>
    <h1>Your files</h1>
    <file-list :data="data" />
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