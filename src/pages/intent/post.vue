<template>
  <div>
    <h1 class="h3">
      {{ title }}
    </h1>
    <div v-if="!posted">
      <compose
        :initial-text="message"
        :focus="true"
        no-photo
        @post="finishPosting"
      />
    </div>
    <div v-else>
      <button class="btn btn-primary my-2" autofocus @click="close">
        Close
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator'
import Compose from '~/components/organisms/Compose.vue'

function getTitle(posted: boolean) {
  return !posted ? 'Share a link' : 'Shared link!'
}

@Component({
  middleware: ['auth'],
  layout: 'no-sidebar',
  components: {
    Compose,
  },
  asyncData({ query }) {
    const { text, url } = query
    const message = text && url ? `[${text}](${url})` : ''
    return {
      message,
      url,
      text,
    }
  },
  head(this: PostIntent) {
    return {
      title: getTitle(this.posted),
    }
  },
})
export default class PostIntent extends Vue {
  message!: string
  posted = false
  get title(): string {
    return getTitle(this.posted)
  }

  finishPosting() {
    this.posted = true
  }

  close() {
    window.close()
  }
}
</script>
