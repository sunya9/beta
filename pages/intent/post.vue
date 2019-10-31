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

<script>
import Compose from '~/components/Compose'

export default {
  middleware: ['auth'],
  layout: 'no-sidebar',
  components: {
    Compose
  },
  computed: {
    title() {
      return !this.posted ? 'Share a link' : 'Shared link!'
    }
  },
  asyncData({ query }) {
    const { text, url } = query
    const message = text && url ? `[${text}](${url})` : ''
    return {
      message,
      url,
      text,
      posted: false
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
      title: this.title
    }
  }
}
</script>
