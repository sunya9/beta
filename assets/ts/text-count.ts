import Vue from 'vue'
import TextCountWorker from '~/assets/js/workers/text-count.worker'

export default Vue.extend({
  data() {
    return {
      text: '',
      textLength: 0,
      worker: new TextCountWorker()
    }
  },
  watch: {
    text: {
      handler(text: string) {
        this.$nextTick()
        this.onUpdateText(text)
      },
      immediate: true
    }
  },
  created() {
    this.worker.addEventListener('message', (e: MessageEvent) => {
      setTimeout(() => {
        this.receiveCount(e)
      }, 0)
    })
  },
  methods: {
    onUpdateText(text: string) {
      setTimeout(() => {
        this.worker.postMessage(text)
      }, 0)
    },

    receiveCount(e: MessageEvent) {
      const length = e.data as number
      this.textLength = length
    }
  }
})
