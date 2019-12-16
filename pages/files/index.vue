<template>
  <div>
    <div class="card">
      <div class="card-body">
        <file-list :data="data" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import FileList from '~/components/file-list.vue'

export default Vue.extend({
  components: {
    FileList
  },
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
  }
})
</script>
