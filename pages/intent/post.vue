<template>
  <div class="mt-5 pt-5">
    <div v-if="!posted">
      <h1 class="h3">Share a link</h1>
      <div class="my-4 compose">
        <div class="card">
          <div>
            <compose-inner @post="finishPosting" no-photo :initial-text="message" :focus="true" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h1 class="h3">Shared link!</h1>
      <button class="btn btn-primary my-2" @click="close" autofocus>Close</button>
    </div>
  </div>
</template>

<script>
import ComposeInner from '~components/ComposeInner'

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
  }
}
</script>