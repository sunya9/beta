<template>
  <div>
  <h1 class="h3">{{title}}</h1>
    <div v-if="!posted">
      <compose @post="finishPosting" no-photo :initial-text="message" :focus="true" />
    </div>
    <div v-else>
      <button class="btn btn-primary my-2" @click="close" autofocus>Close</button>
    </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'

export default {
  middleware: ['auth'],
  layout: 'no-sidebar',
  async asyncData({ query }) {
    const { text, url } = query
    const message = text && url ? `[${text}](${url})` : ''
    return {
      message,
      url,
      text,
      posted: false
    }
  },
  computed: {
    title() {
      return !this.posted ? 'Share a link' : 'Shared link!'
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
  components: {
    Compose
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
