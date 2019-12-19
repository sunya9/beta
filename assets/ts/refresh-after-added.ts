import Vue from 'vue'
import bus from '~/assets/ts/bus'

export default Vue.extend({
  data() {
    return {
      date: Date.now()
    }
  },
  mounted() {
    bus.$on('post', this.add)
  },
  beforeDestroy() {
    bus.$off('post', this.add)
  },
  methods: {
    add() {
      this.date = Date.now()
    }
  }
})
