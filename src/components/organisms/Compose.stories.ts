import { withKnobs } from '@storybook/addon-knobs'
import Compose from './Compose.vue'
import { DeepPartial } from '~/../types'
import { accessorType } from '~/store'
import { assignAccessor } from '~/fixtures/accessor'

export default { title: 'Compose', decorators: [withKnobs] }

const base = (accessor?: DeepPartial<typeof accessorType>) => {
  assignAccessor(accessor)
  return {
    components: { Compose },
  }
}

export const normal = () => ({
  ...base(),
  template: '<compose />',
})
