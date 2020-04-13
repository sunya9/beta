import { Raw } from '~/models/raw'

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
}
