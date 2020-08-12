import Vue from 'vue'
import { withKnobs } from '@storybook/addon-knobs'
import FollowButton from './FollowButton.vue'
import { getUserFixture } from '~/fixtures'
import { User } from '~/entity/user'
import { accessorType } from '~/store'
import { DeepPartial } from '~/../types'

export default { title: 'atoms/FollowButton', decorators: [withKnobs] }

const base = (accessor?: DeepPartial<typeof accessorType>) => {
  Vue.prototype.$accessor = accessor
  return {
    components: { FollowButton },
  }
}

const profile: User = getUserFixture({
  you_follow: false,
})

const me: User = getUserFixture({
  id: '2',
})

export const normal = () => ({
  ...base({ user: me }),
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
  ...base({ user: me }),
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
  ...base({ user: me }),
  data() {
    return {
      profile: blockedUser,
    }
  },
  template: '<follow-button :profile="profile" />',
})
