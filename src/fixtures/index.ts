import { Factory } from 'rosie'
import '~/fixtures/user'
import { User } from '~/entity/user'

type FixtureType = 'user'

const typeMap = {
  user: Factory.build<User>('user'),
} as const

export function getFixtures<T extends keyof typeof typeMap>(fixtureType: T) {
  return typeMap[fixtureType]
}
