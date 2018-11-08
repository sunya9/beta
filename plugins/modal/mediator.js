import Vue from 'vue'

export default new Vue({
  data() {
    return {
      modals: {}
    }
  },
  methods: {
    async show(id, ...arg) {
      if (!this.modals[id]) return
      return this.modals[id].show(...arg)
    },
    async ok(id, arg) {
      if (!this.modals[id]) return
      return this.modals[id].ok(arg)
    },
    async cancel(id, arg) {
      if (!this.modals[id]) return
      return this.modals[id].cancel(arg)
    }
  }
})
