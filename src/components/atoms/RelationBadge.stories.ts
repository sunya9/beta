import RelationBadge from './RelationBadge.vue'
import { getFixtures } from '~/fixtures'
import { User } from '~/entity/user'
import { accessorType } from '~/store'
import { DeepPartial } from '~/../types'
import { assignAccessor } from '~/fixtures/accessor'

export default { title: 'atoms/RelationBadge' }

const base = (accessor?: DeepPartial<typeof accessorType>) => {
  assignAccessor(accessor)
  return {
    components: { RelationBadge },
  }
}

const profile: User = getFixtures('user')

export const normal = () => ({
  ...base(),
  data() {
    return {
      profile,
    }
  },
  template: '<relation-badge :user="profile" />',
})

const notFollowedUser: User = {
  ...getFixtures('user'),
  follows_you: false,
}

export const notFollowed = () => ({
  ...base(),
  data() {
    return {
      profile: notFollowedUser,
    }
  },
  template: '<relation-badge :user="profile" />',
})

const me: User = {
  ...getFixtures('user'),
  follows_you: false,
}

export const myself = () => ({
  ...base({
    user: me,
  }),
  data() {
    return {
      me,
    }
  },
  template: '<relation-badge :user="me" />',
})
