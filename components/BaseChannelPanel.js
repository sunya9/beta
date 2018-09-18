export default {
  props: {
    initialChannel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      channel: this.initialChannel
    }
  },
  watch: {
    channel: {
      handler(channel) {
        this.$emit('update:initialChannel', channel)
      },
      immediate: true,
      deep: true
    }
  }
}
