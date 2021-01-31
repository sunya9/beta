import { withKnobs, select, boolean } from '@storybook/addon-knobs'
import AclSelect from './AclSelect.vue'
import { loginAs } from '~/fixtures/accessor'
import { myselfEntity } from '~/fixtures/user'
import { User } from '~/entity/user'
export default { title: 'atoms/AclSelect', decorators: [withKnobs] }

function base(user?: User) {
  loginAs(user)
  return {
    components: { AclSelect },
  }
}

export const normal = () => ({
  ...base(myselfEntity),
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
