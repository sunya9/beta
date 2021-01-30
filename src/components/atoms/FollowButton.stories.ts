import { withKnobs } from '@storybook/addon-knobs'
import FollowButton from './FollowButton.vue'
import { User } from '~/entity/user'
import { loginAs } from '~/fixtures/accessor'
import { myselfEntity, user } from '~/fixtures/user'

export default { title: 'atoms/FollowButton', decorators: [withKnobs] }

const base = (user?: User) => {
  loginAs(user)
  return {
    components: { FollowButton },
  }
}

const profile = user.build()

export const normal = () => ({
  ...base(myselfEntity),
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
  ...base(myselfEntity),
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
  ...base(myselfEntity),
  data() {
    return {
      profile: blockedUser,
    }
  },
  template: '<follow-button :profile="profile" />',
})
