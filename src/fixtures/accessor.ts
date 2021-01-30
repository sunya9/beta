import Vue from 'vue'
import { getAccessorType } from 'nuxt-typed-vuex'
import { DeepPartial } from '~/../types'

export function assignAccessor(accessor?: DeepPartial<typeof getAccessorType>) {
  Vue.prototype.$accessor = {
    user: { username: 'test' },
    storage: { available: 1, total: 1 },
    ...accessor,
  }
}
