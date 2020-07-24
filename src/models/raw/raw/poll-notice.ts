import { BaseRaw, Raw } from '~/models/raw'
import { Poll } from '~/models/poll'

export namespace PollNotice {
  export const type = 'io.pnut.core.poll-notice' as const
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
    [PollNotice.Replacement.key]: {
      poll_token: string
      poll_id: string
    }
  }
  export namespace Replacement {
    export const key = '+io.pnut.core.poll' as const
  }
  export function createPollNoticeReplecementRaw(
    poll?: Poll
  ): PollNoticeReplacement | undefined {
    if (!poll) return
    const { id: poll_id, poll_token } = poll
    return {
      type: PollNotice.type,
      value: {
        [PollNotice.Replacement.key]: {
          poll_token,
          poll_id,
        },
      },
    }
  }

  export function findPollNotice(raws?: Raw[]) {
    return raws?.find((raw): raw is PollNotice => raw.type === PollNotice.type)
  }
}

export interface PollNotice extends BaseRaw {
  type: typeof PollNotice.type
  value: PollNotice.Value
}

export interface PollNoticeReplacement extends BaseRaw {
  type: typeof PollNotice.type
  value: PollNotice.Replecement
}
