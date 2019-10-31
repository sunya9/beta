import Vue from 'vue'

export default new Vue({
  data() {
    return {
      modals: {}
    }
  },
  methods: {
    show(id, ...arg) {
      if (!this.modals[id]) return
      return this.modals[id].show(...arg)
    },
    ok(id, arg) {
      if (!this.modals[id]) return
      return this.modals[id].ok(arg)
    },
    cancel(id, arg) {
      if (!this.modals[id]) return
      return this.modals[id].cancel(arg)
    }
  }
})
