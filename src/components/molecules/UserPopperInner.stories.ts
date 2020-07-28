import Router from 'vue-router'
import UserPopperInner from './UserPopperInner.vue'
import { getFixtures } from '~/fixtures'
import { accessorType } from '~/store'
import { DeepPartial } from '~/../types'
import { assignAccessor } from '~/fixtures/accessor'

export default { title: 'molecules/UserPopperInner' }

function base(accessor?: DeepPartial<typeof accessorType>) {
  assignAccessor(accessor)
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
    template: '<user-popper-inner :user="user" />',
  }
}
