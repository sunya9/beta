import Vue from 'vue'
import Router from 'vue-router'
import Header from './Header.vue'
import { accessorType } from '~/store'
import { DeepPartial } from '~/../types'
export default { title: 'organisms/Header', decorators: [] }

const base = (accessor?: DeepPartial<typeof accessorType>) => {
  Vue.prototype.$accessor = accessor

  return {
    components: {
      Header,
    },
    router: new Router(),
  }
}

export const notLoggedIn = () => ({
  ...base({
    user: null,
  }),
  template: '<Header />',
})

export const loggedIn = () => ({
  ...base({
    user: {
      username: 'test',
    },
  }),
  template: '<Header />',
})
