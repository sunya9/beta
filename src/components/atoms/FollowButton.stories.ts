import { withKnobs } from '@storybook/addon-knobs'
import FollowButton from './FollowButton.vue'
import { getFixtures } from '~/fixtures'
import { User } from '~/models/user'

export default { title: 'atoms/FollowButton', decorators: [withKnobs] }

const base = {
  components: { FollowButton },
}

const profile: User = {
  ...getFixtures('user'),
  you_follow: false,
}

export const normal = () => ({
  ...base,
  data() {
    return {
      profile,
    }
  },
  template: '<follow-button :profile="profile" />',
})

const followingUser: User = {
  ...profile,
  you_follow: true,
}

export const following = () => ({
  ...base,
  data() {
    return {
      profile: followingUser,
    }
  },
  template: '<follow-button :profile="profile" />',
})

const blockedUser: User = {
  ...profile,
  you_blocked: true,
}

export const blocked = () => ({
  ...base,
  data() {
    return {
      profile: blockedUser,
    }
  },
  template: '<follow-button :profile="profile" />',
})
