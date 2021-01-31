import Router from 'vue-router'
import Profile from './Profile.vue'
import { user, myselfEntity } from '~/fixtures/user'
import { User } from '~/entity/user'
import { loginAs } from '~/fixtures/accessor'

export default { title: 'organisms/Profile', decorators: [] }

const base = (user?: User) => {
  loginAs(user)

  return {
    components: {
      Profile,
    },
    router: new Router(),
  }
}

export const normal = () => ({
  ...base(myselfEntity),
  data() {
    return {
      user: user.build(),
    }
  },
  template: '<profile :initial-profile="user" />',
})

export const myself = () => ({
  ...base(myselfEntity),
  data() {
    return {
      user: myselfEntity,
    }
  },
  template: '<profile :initial-profile="user" />',
})
