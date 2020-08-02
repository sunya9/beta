import { fixtures } from '../helper'
import { testClient } from './client'
import { Poll } from '~/entity/poll'
import { User } from '~/entity/user'

const now = new Date()
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

const options: Poll.PollOption[] = Array(5)
  .fill(undefined)
  .map((_, i) => ({
    text: `option ${i + 1}`,
    position: i + 1,
  }))

const basePoll: Poll = {
  created_at: new Date(),
  id: '1',
  is_anonymous: true,
  is_public: false,
  source: testClient,
  max_options: 1,
  type: 'net.unsweets.beta',
  you_responded: false,
  user: fixtures<User>('user'),
  closed_at: nextWeek,
  options,
  poll_token: 'poll_token',
  prompt: 'prompt message',
}

export default basePoll

export const detail = {
  created_at: now,
  is_public: true,
  is_anonymous: false,
  id: '1',
}

export const closed = {
  closed_at: oneDayAgo,
}

export const responded = {
  you_responded: true,
  options: options.map((option, i) => {
    option.is_your_response = !i
    option.respondents = +!i
    return option
  }),
}
