import { withKnobs, boolean } from '@storybook/addon-knobs'
import CustomCheckbox from './CustomCheckbox.vue'
export default { title: 'CustomCheckbox', decorators: [withKnobs] }

const base = {
  components: { CustomCheckbox },
}

export const normal = () => ({
  ...base,
  props: {
    value: {
      type: Boolean,
      required: true,
      default: boolean('check', false),
    },
  },
  template: '<custom-checkbox v-model="value">text</custom-checkbox>',
})

export const checked = () => ({
  ...base,
  props: {
    value: {
      type: Boolean,
      required: true,
      default: boolean('check', true),
    },
  },
  template: '<custom-checkbox v-model="value">text</custom-checkbox>',
})

export const disabled = () => ({
  ...base,
  props: {
    value: {
      type: Boolean,
      required: true,
      default: boolean('check', false),
    },
  },
  template: '<custom-checkbox v-model="value" disabled>text</custom-checkbox>',
})
