import Vue from 'vue'

type mediatorType = {
  show<T>(id: string, ...arg: any): Promise<T>
  ok<T>(id: string, arg: any): Promise<T>
  cancel<T>(id: string, arg: any): Promise<T>
}

const mediator: mediatorType = new Vue({
  data(): {
    modals: {
      [key: string]: {
        show(...arg: any): Promise<any>
        ok(arg: any): Promise<any>
        cancel(arg: any): Promise<any>
      }
    }
  } {
    return {
      modals: {}
    }
  },
  methods: {
    show(id: string, ...arg: any) {
      if (!this.modals[id]) return
      return this.modals[id].show(...arg)
    },
    ok(id: string, arg: any) {
      if (!this.modals[id]) return
      return this.modals[id].ok(arg)
    },
    cancel(id: string, arg: any) {
      if (!this.modals[id]) return
      return this.modals[id].cancel(arg)
    }
  }
})

export default mediator
