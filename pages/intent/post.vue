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
import Compose from '~/components/Compose.vue'

function getTitle(posted: boolean) {
  return !posted ? 'Share a link' : 'Shared link!'
}

export default Vue.extend({
  middleware: ['auth'],
  layout: 'no-sidebar',
  components: {
    Compose
  },
  data() {
    return {
      posted: false
    }
  },
  computed: {
    title(): string {
      return getTitle(this.posted)
    }
  },
  asyncData({ query }) {
    const { text, url } = query
    const message = text && url ? `[${text}](${url})` : ''
    return {
      message,
      url,
      text
    }
  },
  methods: {
    finishPosting() {
      this.posted = true
    },
    close() {
      window.close()
    }
  },
  head() {
    return {
      // TODO
      title: getTitle((this as any).posted)
    }
  }
})
</script>
