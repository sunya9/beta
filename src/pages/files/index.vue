<template>
  <div>
    <div class="card">
      <div class="card-body">
        <file-list :key="$route.fullPath" :data="data" :options="options" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { File } from '../../models/file'
import FileList from '~/components/file-list.vue'

const map: { [key in File.Kind]: string } = {
  audio: ['mpeg', 'mp4', 'wave', 'flac'].map((ext) => `audio/${ext}`).join(','),
  video: ['mpeg', 'webm'].map((ext) => `video/${ext}`).join(','),
  image: ['png', 'jpeg', 'gif'].map((ext) => `image/${ext}`).join(','),
  other: '',
} as const

function isKind(kindStr: string): kindStr is File.Kind {
  return Object.keys(map).includes(kindStr)
}

function kind2mimeTypes(kindStr: string) {
  return isKind(kindStr) ? map[kindStr] : ''
}

export default Vue.extend({
  components: {
    FileList,
  },
  async asyncData({
    app: { $resource },
    route: {
      query: { kind },
    },
  }) {
    const options = {
      mime_types: kind ? kind2mimeTypes(kind.toString()) : undefined,
    }
    const data = await $resource({ options })
    return {
      data,
      options,
    }
  },
  head() {
    return {
      title: 'Your files',
    }
  },
  watchQuery: true,
  key: (route) => route.fullPath,
})
</script>
