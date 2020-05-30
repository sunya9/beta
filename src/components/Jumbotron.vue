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
import { Mixins, Component } from 'vue-property-decorator'
import search from '~/assets/ts/search'

@Component({})
export default class Jumbotron extends Mixins(search) {}
</script>
