import { boolean, withKnobs } from '@storybook/addon-knobs'
import ToggleButton from './ToggleButton.vue'
import { User } from '~/entity/user'
import { loginAs } from '~/fixtures/accessor'

export default { title: 'atoms/ToggleButton', decorators: [withKnobs] }

const base = (user?:User) => {
  loginAs(user)
  return {
    components: { ToggleButton },
  }
}

export const normal = () => ({
  ...base(),
  data() {
    return {
      value: boolean('check', false),
    }
  },
  template: '<toggle-button icon="times" v-model="value" text="button" />',
})

export const active = () => ({
  ...base(),
  data() {
    return {
      value: boolean('check', true),
    }
  },
  template: '<toggle-button icon="times" v-model="value" text="button" />',
})

export const disabled = () => ({
  ...base(),
  data() {
    return {
      value: boolean('check', false),
    }
  },
  template:
    '<toggle-button icon="times" v-model="value" text="button" disabled />',
})

export const activeDisabled = () => ({
  ...base(),
  data() {
    return {
      value: boolean('check', true),
    }
  },
  template:
    '<toggle-button icon="times" v-model="value" text="button" disabled />',
})
