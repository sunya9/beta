export type GeneralPollParameters = {
  include_closed?: boolean
  include_private?: boolean
  poll_types?: string[]
  exclude_poll_types?: string[]
  include_raw?: boolean
  include_poll_raw?: boolean
}

export type PostPollRequest = {
  prompt: string
  type: string
  options: {
    text: string
    position?: number
  }[]
  is_public?: boolean
  is_anonymous?: boolean
  max_options?: number
} & ({ closed_at: Date } | { duration: Date })

export type PutPollResponseRequest = {
  poll_id: string
  poll_token: string
  positions: number[]
}

export type PollIdRequest = { poll_id: string }
