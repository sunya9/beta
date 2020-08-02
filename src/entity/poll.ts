import { Client } from './client'
import { User } from './user'

export interface Poll {
  closed_at: Date
  created_at: Date
  id: string
  is_anonymous: boolean
  is_public: boolean
  max_options: number
  options: Poll.PollOption[]
  poll_token: string
  prompt: string
  source: Client.Source
  type: string
  user?: User
  you_responded: boolean
}

export namespace Poll {
  export interface PostBody extends Pick<Poll, 'prompt' | 'type' | 'options'> {
    duration: number
  }
  export interface PollOption {
    text: string
    position: number
    is_your_response?: boolean
    respondents?: number
    respondent_ids?: string[]
  }
}
