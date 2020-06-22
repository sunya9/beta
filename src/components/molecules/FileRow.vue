<template>
  <tr :class="{ 'table-active': file.select }" @click.stop="toggleSelect">
    <td class="text-center">
      <input type="checkbox" :checked="file.select" />
    </td>
    <td>
      <div class="d-flex">
        <nuxt-link :to="`/files/${file.id}`" @click.native.stop>
          {{ file.name }}
        </nuxt-link>
      </div>
    </td>
    <td>{{ date }}</td>
    <td class="text-center text-light">
      <span v-if="file.image_info" class="thumb ml-auto">
        <img :src="file.link" height="24" />
      </span>
      <font-awesome-icon
        v-else-if="file.video_info"
        :icon="['far', 'file-video']"
      />
      <font-awesome-icon
        v-else-if="file.audio_info"
        :icon="['far', 'file-audio']"
      />
      <font-awesome-icon v-else :icon="['far', 'file']" />
    </td>
  </tr>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ModifiedFile } from '~/plugins/domain/usecases/getFiles'

export default Vue.extend({
  props: {
    file: {
      type: Object,
      required: true,
    } as PropOptions<ModifiedFile>,
  },
  computed: {
    date(): string {
      return this.$dayjs(this.file.created_at).format('LLL')
    },
  },
  methods: {
    toggleSelect() {
      this.$emit('update:file', {
        ...this.file,
        select: !this.file.select,
      })
    },
  },
})
</script>
<style scoped>
.buttons a {
  opacity: 0;
  transition: all 0.2s ease;
}
tr:hover .buttons a {
  opacity: 1;
}
.thumb {
  min-width: 20px;
  max-height: 20px;
  box-sizing: content-box;
  overflow: hidden;
}
.thumb img {
  max-width: 20px;
  max-height: 20px;
}
</style>
