<template>
  <div class="mt-5 pt-5">
  <h1 class="h3">{{title}}</h1>
    <div v-if="!posted">
      <div class="my-4 compose">
        <div class="card">
          <div>
            <compose-inner @post="finishPosting" no-photo :initial-text="message" :focus="true" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <button class="btn btn-primary my-2" @click="close" autofocus>Close</button>
    </div>
  </div>
</template>

<script>
import ComposeInner from '~/components/ComposeInner'

export default {
  middleware: 'authenticated',
  layout: 'intent',
  async asyncData ({ query }) {
    const { text, url } = query
    const message = text && url ? `[${text}](${url})` : ''
    return {
      message, url, text, posted: false
    }
  },
  computed: {
    title () {
      return !this.posted
        ? 'Share a link'
        : 'Shared link!'
    }
  },
  methods: {
    finishPosting () {
      this.posted = true
    },
    close () {
      window.close()
    }
  },
  components: {
    ComposeInner
  },
  head () {
    return {
      title: this.title
    }
  }
}
</script>
