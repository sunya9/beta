import bus from '~/assets/js/bus'

export default {
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
}
