import Router from 'vue-router'
import Profile from './Profile.vue'
import { accessorType } from '~/store'
import { DeepPartial } from '~/../types'
import { user, myself as myselfEntity } from '~/fixtures/user'
import { assignAccessor } from '~/fixtures/accessor'

export default { title: 'organisms/Profile', decorators: [] }

const base = (accessor?: DeepPartial<typeof accessorType>) => {
  assignAccessor(accessor)

  return {
    components: {
      Profile,
    },
    router: new Router(),
  }
}

export const normal = () => ({
  ...base({
    user: myselfEntity,
  }),
  data() {
    return {
      user: user.build(),
    }
  },
  template: '<profile :initial-profile="user" />',
})

export const myself = () => ({
  ...base({
    user: myselfEntity,
  }),
  data() {
    return {
      user: myselfEntity,
    }
  },
  template: '<profile :initial-profile="user" />',
})
