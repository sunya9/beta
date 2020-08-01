import Vue, { PropOptions } from 'vue'
import { Channel } from '~/models/channel'

export const BaseChannelPanel = Vue.extend({
  props: {
    initialChannel: {
      type: Object,
      required: true,
    } as PropOptions<Channel>,
  },
  data() {
    return {
      channel: this.initialChannel,
    }
  },
  watch: {
    channel: {
      handler(channel) {
        this.$emit('update:initialChannel', channel)
      },
      immediate: true,
      deep: true,
    },
  },
})
