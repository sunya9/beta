import { Raw } from '~/models/raw'
import { Poll } from '~/models/poll'

export type PollNotice = Raw<PollNotice.Value>

export namespace PollNotice {
  export const type = 'io.pnut.core.poll-notice'
  export interface Value {
    prompt: string
    poll_token: string
    closed_at: Date
    poll_id: string
    options: Value.PollOption[]
  }
  export namespace Value {
    export interface PollOption {
      text: string
      position: number
    }
  }
  export interface Replecement {
    '+io.pnut.core.poll': {
      poll_token: string
      poll_id: string
    }
  }
  export function createPollNoticeReplecementRaw(
    poll?: Poll
  ): Raw<PollNotice.Replecement> | undefined {
    if (!poll) return
    const { id: poll_id, poll_token } = poll
    return {
      type: 'io.pnut.core.poll-notice',
      value: {
        '+io.pnut.core.poll': {
          poll_token,
          poll_id,
        },
      },
    }
  }
}
