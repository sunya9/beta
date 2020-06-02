import Vue from 'vue'
import Router from 'vue-router'
import UserPopperInner from './UserPopperInner.vue'
import { getFixtures } from '~/fixtures'
import { accessorType } from '~/store'
import { DeepPartial } from '~/../types'

export default { title: 'UserPopperInner' }

function base(accessor?: DeepPartial<typeof accessorType>) {
  Vue.prototype.$accessor = {
    ...accessor,
    user: { username: 'test' },
    storage: { available: 1, total: 1 },
  }
  return {
    components: { UserPopperInner },
    router: new Router(),
  }
}

export const normal = () => {
  return {
    ...base(),
    props: {
      user: {
        type: Object,
        default: () => getFixtures('user'),
      },
    },
    template: '<span>{{user.created_at}}</span>',
  }
}
