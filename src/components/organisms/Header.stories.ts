import Router from 'vue-router'
import Header from './Header.vue'
import {  loginAs } from '~/fixtures/accessor'
import { User } from '~/entity/user'
import { myselfEntity } from '~/fixtures/user'
export default { title: 'organisms/Header', decorators: [] }

const base = (user?:User) => {
  loginAs(user)

  return {
    components: {
      Header,
    },
    router: new Router(),
  }
}

export const notLoggedIn = () => ({
  ...base(),
  template: '<Header />',
})

export const loggedIn = () => ({
  ...base(myselfEntity),
  template: '<Header />',
})
