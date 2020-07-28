import Vue from 'vue'
import { withKnobs, select, boolean } from '@storybook/addon-knobs'
import AclSelect from './AclSelect.vue'
import { accessorType } from '~/store'
import { DeepPartial } from '~/../types'
export default { title: 'atoms/AclSelect', decorators: [withKnobs] }

function base(accessor?: DeepPartial<typeof accessorType>) {
  Vue.prototype.$accessor = accessor
  return {
    components: { AclSelect },
  }
}

export const normal = () => ({
  ...base({
    user: { username: 'test' },
  }),
  props: {
    permission: {
      type: String,
      default: select('permission', ['read', 'write', 'full'], 'read'),
    },
    anyUserWrite: {
      type: Boolean,
      default: boolean('anyUserWrite', false),
    },
  },
  template: '<acl-select :value="permission" :anyUserWrite="anyUserWrite" />',
})
