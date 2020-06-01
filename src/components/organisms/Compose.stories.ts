import Vue from 'vue'
import { withKnobs } from '@storybook/addon-knobs'
import Compose from './Compose.vue'
import { DeepPartial } from '~/../types'
import { accessorType } from '~/store'

export default { title: 'Compose', decorators: [withKnobs] }

const base = (accessor?: DeepPartial<typeof accessorType>) => {
  Vue.prototype.$accessor = {
    ...accessor,
    user: { username: 'test' },
    storage: { available: 1, total: 1 },
  }
  return {
    components: { Compose },
  }
}

export const normal = () => ({
  ...base(),
  template: '<compose />',
})
