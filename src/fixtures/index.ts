import { poll } from '~/fixtures/poll'
import { user } from '~/fixtures/user'
import { client } from '~/fixtures/client'

const typeMap = {
  user,
  poll,
  client,
} as const

export function getFixtures<T extends keyof typeof typeMap>(fixtureType: T) {
  return typeMap[fixtureType].build()
}

export function buildFixtures<T extends keyof typeof typeMap>(fixtureType: T) {
  return typeMap[fixtureType].build
}
