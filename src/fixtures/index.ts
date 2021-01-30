import { IFactory } from 'rosie'
import { poll } from '~/fixtures/poll'
import { user } from '~/fixtures/user'
import { client } from '~/fixtures/client'
import { Poll } from '~/entity/poll'
import { User } from '~/entity/user'
import { Client } from '~/entity/client'

const typeMap = {
  user,
  poll,
  client,
} as const

export function getUserFixture(attrs?: Parameters<IFactory<User>['build']>[0]) {
  return typeMap.user.build(attrs)
}

export function getPollFixture(attrs?: Parameters<IFactory<Poll>['build']>[0]) {
  return typeMap.poll.build(attrs)
}
