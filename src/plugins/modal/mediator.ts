import Vue from 'vue'

interface MediatorMethods {
  show<T>(id: string, ...arg: any): Promise<T> | void
  ok<T>(id: string, arg: any): Promise<T> | void
  cancel<T>(id: string, arg: any): Promise<T> | void
}

interface Data {
  modals: {
    [key: string]: {
      show<T>(...arg: any): Promise<T> | void
      ok<T>(arg: any): Promise<T> | void
      cancel<T>(arg: any): Promise<T> | void
    }
  }
}

export const mediator = new Vue<Data, MediatorMethods, {}, {}>({
  data(): Data {
    return {
      modals: {},
    }
  },
  methods: {
    show(id: string, ...arg: any): Promise<any> | void {
      if (!this.modals[id]) return
      return this.modals[id].show(...arg)
    },
    ok(id: string, arg: any): Promise<any> | void {
      if (!this.modals[id]) return
      return this.modals[id].ok(arg)
    },
    cancel(id: string, arg: any): Promise<any> | void {
      if (!this.modals[id]) return
      return this.modals[id].cancel(arg)
    },
  },
})

export default mediator
