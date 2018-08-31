<template>
  <tr
    :class="{ 'table-active': file.select }"
    @click="toggleSelect">
    <td class="text-center"><input
      v-model="file.select"
      type="checkbox"
      @click.stop></td>
    <td>
      <div class="d-flex">
        <a
          :href="file.link"
          target="_new"
          class=""
          @click.stop>
          {{ file.name }}
        </a>
      </div>
    </td>
    <td>
      {{ date }}
    </td>
    <td>
      <span class="thumb ml-auto">
        <img
          v-if="file.image_info"
          :src="file.link"
          height="24">
      </span>
    </td>
  </tr>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    date() {
      return moment(this.file.created_at).format('LLL')
    }
  },
  methods: {
    toggleSelect() {
      this.file.select = !this.file.select
    }
  }
}
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
