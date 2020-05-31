import { withKnobs, select, boolean } from '@storybook/addon-knobs'
import AclSelect from './AclSelect.vue'
export default { title: 'AclSelect', decorators: [withKnobs] }

const base = {
  components: { AclSelect },
}

export const normal = () => ({
  ...base,
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
