<template>
  <div class="jumbotron">
    <div class="container">
      <h1 class="">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import search from '~/assets/ts/search'

export default Vue.extend({
  mixins: [search],
})
</script>
