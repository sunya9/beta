import { withKnobs } from '@storybook/addon-knobs'
import MuteButton from './MuteButton.vue'
import { getFixtures } from '~/fixtures'
import { User } from '~/models/user'

export default { title: 'MuteButton', decorators: [withKnobs] }

const base = {
  components: { MuteButton },
}

const profile: User = getFixtures('user')

export const normal = () => ({
  ...base,
  data() {
    return {
      profile,
    }
  },
  template: '<mute-button :profile="profile" />',
})

const mutedUser: User = {
  ...profile,
  you_muted: true,
}

export const enabled = () => ({
  ...base,
  data() {
    return {
      profile: mutedUser,
    }
  },
  template: '<mute-button :profile="profile" />',
})
