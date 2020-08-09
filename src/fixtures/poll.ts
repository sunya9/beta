import { Factory } from 'rosie'
import { Poll } from '~/entity/poll'
import { client } from '~/fixtures/client'
import { user } from '~/fixtures/user'

const now = new Date()
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

const options: Poll.PollOption[] = Array(5)
  .fill(undefined)
  .map((_, i) => ({
    text: `option ${i + 1}`,
    position: i + 1,
  }))

export const poll = new Factory<Poll>().sequence('id').attrs({
  created_at: new Date(),
  is_anonymous: true,
  is_public: false,
  source: client.build(),
  max_options: 1,
  type: 'net.unsweets.beta',
  you_responded: false,
  user: user.build(),
  closed_at: nextWeek,
  options,
  poll_token: 'poll_token',
  prompt: 'prompt message',
})
