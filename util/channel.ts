import { Channel } from '~/models/channel'

export function userIdsIsString(
  userIds: Array<string | Channel.SimpleUser>
): userIds is string[] {
  return userIds.every(item => typeof item === 'string')
}
