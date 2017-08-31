<template>
  <tr @click="toggleSelect" :class="{ 'table-active': file.select }">
    <td class="text-center"><input type="checkbox" v-model="file.select" @click.stop></td>
    <td>{{file.id}}</td>
    <td>
      <div class="d-flex">
        <a :href="file.link" target="_new" class="">
          {{file.name}}
        </a>
        <span class="thumb ml-auto">
          <img v-if="file.image_info"
            height="24"
            :src="file.link">
        </span>
      </div>
    </td>
  </tr>
</template>
<script>
export default {
  props: ['file'],
  methods: {
    toggleSelect () {
      this.file.select = !this.file.select
    }
  }
}
</script>
<style scoped>
.buttons a {
  opacity: 0;
  transition: all .2s ease;
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