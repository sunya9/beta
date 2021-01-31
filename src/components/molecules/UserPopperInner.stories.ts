import Router from 'vue-router'
import UserPopperInner from './UserPopperInner.vue'
import { getUserFixture } from '~/fixtures'
import { User } from '~/entity/user'
import { loginAs } from '~/fixtures/accessor'

export default { title: 'molecules/UserPopperInner' }

function base(user?: User) {
  loginAs(user)
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
        default: () => getUserFixture(),
      },
    },
    template: '<user-popper-inner :user="user" />',
  }
}
