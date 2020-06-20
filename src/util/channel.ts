import { Channel } from '~/models/channel'

export function userIdsIsString(
  userIds: Array<string | Channel.SimpleUser>
): userIds is string[] {
  return !!userIds.length && userIds.every((item) => typeof item === 'string')
}

export function userIdIsSimpleUser(
  userId: string | Channel.SimpleUser
): userId is Channel.SimpleUser {
  return typeof userId !== 'string'
}
