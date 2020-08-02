<template>
  <a :href="source.link">{{ source.name }}</a>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Source } from '~/entity/source'

@Component
export default class SourceLink extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  source!: Source
}
</script>
