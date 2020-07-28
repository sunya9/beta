import { withKnobs, select } from '@storybook/addon-knobs'
import Avatar from './Avatar.vue'
export default { title: 'atoms/Avatar', decorators: [withKnobs] }

const base = {
  components: { Avatar },
}

export const normal = () => ({
  ...base,
  props: {
    size: {
      type: Number,
      default: select('size', [0, 16, 24, 32, 64, 96], 24),
    },
  },
  template: '<avatar :size="size" avatar="https://via.placeholder.com/192" />',
})

export const placeholder = () => ({
  ...base,
  template:
    '<avatar enable-placeholder avatar="https://via.placeholder.com/192" />',
})

export const userImage = () => ({
  ...base,
  template: `<avatar :avatar="{ link: 'https://via.placeholder.com/192' }" />`,
})
