import { withKnobs } from '@storybook/addon-knobs'
import Compose from './Compose.vue'
import { loginAs } from '~/fixtures/accessor'
import { User } from '~/entity/user'

export default { title: 'organisms/Compose', decorators: [withKnobs] }

const base = (user?: User) => {
  loginAs(user)
  return {
    components: { Compose },
  }
}

export const normal = () => ({
  ...base(),
  template: '<compose />',
})
