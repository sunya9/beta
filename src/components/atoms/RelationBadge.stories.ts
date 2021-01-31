import RelationBadge from './RelationBadge.vue'
import { getUserFixture } from '~/fixtures'
import { User } from '~/entity/user'
import { loginAs } from '~/fixtures/accessor'
import { myselfEntity } from '~/fixtures/user'

export default { title: 'atoms/RelationBadge' }

const base = (user?: User) => {
  loginAs(user)
  return {
    components: { RelationBadge },
  }
}

const profile: User = getUserFixture({
  you_can_follow: true,
})

export const normal = () => ({
  ...base(),
  data() {
    return {
      profile,
    }
  },
  template: '<relation-badge :user="profile" />',
})

const notFollowedUser: User = getUserFixture({
  follows_you: false,
})

export const notFollowed = () => ({
  ...base(),
  data() {
    return {
      profile: notFollowedUser,
    }
  },
  template: '<relation-badge :user="profile" />',
})

const me: User = getUserFixture({
  follows_you: false,
})

export const myself = () => ({
  ...base(myselfEntity),
  data() {
    return {
      me,
    }
  },
  template: '<relation-badge :user="me" />',
})
